import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  // Throttle updates to DB to avoid spam (Map<patientId, lastUpdateTime>)
  private lastUpdate = new Map<number, number>();

  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    console.log('EventsGateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe.patient')
  handleSubscribePatient(client: Socket, data: { patientId: number }) {
    const room = `patient_${data.patientId}`;
    client.join(room);
    console.log(`Client ${client.id} subscribed to patient ${data.patientId}`);
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

    // Inject the resolved ID back into data so clients know
    data.patientId = patientId;

    console.log('📊 VITALS RECEIVED:', JSON.stringify(data, null, 2));
    console.log(`📡 Broadcasting to room: patient_${patientId}`);
    
    // 1. Broadcast to room immediately for live view
    this.server.to(`patient_${patientId}`).emit('vitals.update', data);
    console.log('✅ Vitals broadcast complete');

    // 2. Persist to DB (Throttled: e.g. every 5 seconds)
    const now = Date.now();
    const last = this.lastUpdate.get(patientId) || 0;
    
    // Save snapshot every 5 seconds to keep "latest known state" fresh in DB
    if (now - last > 5000) {
      this.lastUpdate.set(patientId, now);
      try {
        await this.prisma.patient.update({
          where: { id: parseInt(patientId) },
          data: { latestVitals: data }
        });
      } catch (e) {
        console.error(`Failed to persist vitals snapshot for patient ${patientId}`, e);
      }
    }
  }
  
  
  @SubscribeMessage('patient.emergency')
  handlePatientEmergency(client: Socket, data: any) {
    console.log(`[EMERGENCY] Received alert for Patient ${data.patientId}:`, data);
    
    // Broadcast to the specific patient room so subscribed doctors/family get it
    if (data && data.patientId) {
      this.server.to(`patient_${data.patientId}`).emit('patient.emergency', data);
      console.log(`[EMERGENCY] Broadcasted to room patient_${data.patientId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, data: { senderId: number; recipientId: number; message: string }) {
    console.log(`[CHAT] Message from ${data.senderId} to ${data.recipientId}: ${data.message}`);
    
    // Store message in chat service
    const savedMessage = this.chatService.addMessage(data.senderId, data.recipientId, data.message);
    
    // Emit to recipient's user room (assuming users join rooms like "user_<userId>")
    this.server.to(`user_${data.recipientId}`).emit('receiveMessage', savedMessage);
    
    // Also send back to sender for confirmation
    client.emit('receiveMessage', savedMessage);
    
    return { success: true, message: savedMessage };
  }

  @SubscribeMessage('subscribe.user')
  handleSubscribeUser(client: Socket, data: { userId: number }) {
    const room = `user_${data.userId}`;
    client.join(room);
    console.log(`Client ${client.id} subscribed to user ${data.userId}`);
    return { event: 'user.subscribed', data: { room } };
  }
}
