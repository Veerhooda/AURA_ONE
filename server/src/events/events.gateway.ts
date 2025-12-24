import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { VitalsValidationService } from '../vitals/vitals-validation.service';
import { EmergencyAlertDto } from './dto/emergency-alert.dto';
import { EmergencyService } from '../emergency/emergency.service'; // Finding #14


@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  // Throttle updates to DB to avoid spam (Map<patientId, lastUpdateTime>)
  private lastUpdate = new Map<number, number>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private vitalsValidation: VitalsValidationService, // C13: Vitals validation
    private emergencyService: EmergencyService, // Finding #14: Emergency persistence
  ) {}

  afterInit(server: Server) {
    console.log('EventsGateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    // C7: Validate JWT token on connection
    try {
      console.log(`🔌 Connection attempt: ${client.id}`);
      
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.warn(`❌ Client ${client.id} missing token. Query:`, client.handshake.query);
        console.warn(`❌ Client ${client.id} attempted connection without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      
      // Store user context in socket for authorization checks
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        doctorId: payload.doctorId,
      };
      
      console.log(`✅ Client ${client.id} connected as ${payload.role} (${payload.email})`);
    } catch (error) {
      console.error(`❌ Invalid token for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe.patient')
  async handleSubscribePatient(client: Socket, data: { patientId: number }) {
    // C7: Verify user has permission to view this patient
    const user = client.data.user;
    
    if (!user) {
      client.emit('error', { message: 'Unauthorized: No user context' });
      return;
    }

    const patientId = data.patientId;
    let authorized = false;

    // Authorization logic based on role
    if (user.role === 'DOCTOR' || user.role === 'NURSE' || user.role === 'ADMIN') {
      authorized = true;
    } else if (user.role === 'PATIENT') {
      const patient = await this.prisma.patient.findFirst({
        where: { userId: user.userId }
      });
      authorized = patient && patient.id === patientId;
    } else if (user.role === 'FAMILY') {
      const relation = await this.prisma.userPatientRelation.findFirst({
        where: {
          userId: user.userId,
          patientId: patientId,
        }
      });
      authorized = !!relation;
    }

    if (!authorized) {
      console.warn(`⚠️  User ${user.email} (${user.role}) denied access to patient ${patientId}`);
      client.emit('error', { message: 'Unauthorized: Access denied to this patient' });
      return;
    }

    const room = `patient_${patientId}`;
    client.join(room);
    console.log(`✅ Client ${client.id} (${user.role}) subscribed to patient ${patientId}`);
    return { event: 'subscribed', data: { room } };
  }

  @SubscribeMessage('unsubscribe.patient')
  handleUnsubscribePatient(client: Socket, data: { patientId: number }) {
    const room = `patient_${data.patientId}`;
    client.leave(room);
    console.log(`Client ${client.id} unsubscribed from patient ${data.patientId}`);
    return { event: 'unsubscribed', data: { room } };
  }

  @SubscribeMessage('simulate_vitals')
  async handleSimulateVitals(client: Socket, data: any) {
    let patientId = data.patientId;

    // Resolve patient by Email if provided
    if (!patientId && data.email) {
      const patient = await this.prisma.patient.findFirst({
        where: { user: { email: data.email } },
      });
      if (patient) {
        patientId = patient.id;
      }
    }

    if (!patientId) {
      console.error('❌ No patientId in vitals data');
      return;
    }

    data.patientId = patientId;

    // C13: Validate vitals data
    const validation = this.vitalsValidation.validate(data);
    
    if (!validation.isValid) {
      console.error(`❌ Invalid vitals data for patient ${patientId}:`, validation.errors);
      client.emit('error', { 
        message: 'Invalid vitals data', 
        errors: validation.errors 
      });
      return;
    }

    // Log warnings for suspicious values
    if (validation.warnings.length > 0) {
      console.warn(`⚠️  Vitals warnings for patient ${patientId}:`, validation.warnings);
    }

    console.log('📊 VITALS RECEIVED:', JSON.stringify(data, null, 2));
    console.log(`📡 Broadcasting to room: patient_${patientId}`);
    
    // 1. Broadcast to room immediately for live view
    this.server.to(`patient_${patientId}`).emit('vitals.update', data);
    console.log('✅ Vitals broadcast complete');

    // 2. Persist to DB (Throttled: every 5 seconds)
    const now = Date.now();
    const last = this.lastUpdate.get(patientId) || 0;
    
    if (now - last > 5000) {
      this.lastUpdate.set(patientId, now);
      try {
        await this.prisma.patient.update({
          where: { id: parseInt(patientId) },
          data: { latestVitals: data }
        });
      } catch (e) {
        // C8: Log vitals persistence failure
        console.error(`🚨 Failed to persist vitals for patient ${patientId}`, e);
        
        /*
        try {
          await this.prisma.vitalsFailureLog.create({
            data: {
              patientId: parseInt(patientId),
              vitalsData: data,
              error: e.message,
              retryCount: 0,
            }
          });
        } catch (logError) {
          console.error('🚨 CRITICAL: Failed to log vitals failure:', logError);
        }
        */
      }
    }
  }
  
  @SubscribeMessage('patient.emergency')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handlePatientEmergency(client: Socket, @MessageBody() data: EmergencyAlertDto) {
    // C9: Validated emergency alert
    console.log(`[EMERGENCY] Received alert for Patient ${data.patientId}:`, data);
    
    // Broadcast to the specific patient room
    if (data && data.patientId) {
      this.server.to(`patient_${data.patientId}`).emit('patient.emergency', data);
      console.log(`[EMERGENCY] Broadcasted to room patient_${data.patientId}`);
    }
  }

  @SubscribeMessage('subscribe.user')
  handleSubscribeUser(client: Socket, data: { userId: number }) {
    const room = `user_${data.userId}`;
    client.join(room);
    console.log(`Client ${client.id} subscribed to user ${data.userId}`);
    return { event: 'user.subscribed', data: { room } };
  }

  // C14: Public method for other services to broadcast vitals
  broadcastVitals(patientId: number, data: any) {
    this.server.to(`patient_${patientId}`).emit('vitals.update', data);
    console.log(`📡 Broadcasted vitals for patient ${patientId} from generic source`);
  }
}
