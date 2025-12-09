import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // Simulate real-time data intervals for active sessions
  private activeSessions = new Map<string, NodeJS.Timeout>();

  onModuleInit() {
    console.log('EventsGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.stopStreaming(client.id);
  }

  @SubscribeMessage('subscribe.patient')
  handleSubscribePatient(
    @MessageBody() data: { patientId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Client ${client.id} subscribed to patient ${data.patientId}`);
    this.startStreaming(client.id, data.patientId);
    return { event: 'subscribed', data: data.patientId };
  }

  @SubscribeMessage('unsubscribe.patient')
  handleUnsubscribePatient(@ConnectedSocket() client: Socket) {
    this.stopStreaming(client.id);
    return { event: 'unsubscribed' };
  }

  private startStreaming(clientId: string, patientId: number) {
    // Prevent duplicate streams
    if (this.activeSessions.has(clientId)) {
      clearInterval(this.activeSessions.get(clientId));
    }

    // 60Hz ECG Simulation (approx 16ms)
    // We'll send batches or single points. For this demo, let's send updates every 100ms with multiple points to be smoother on network
    // OR just send single points if we want "true" streaming feel, but 60Hz over network is heavy.
    // Let's do 10Hz updates, sending arrays of data.

    let time = 0;
    const interval = setInterval(() => {
      // Generate synthetic ECG PQRST wave + Noise
      const heartRate = 60 + Math.sin(time * 0.1) * 10; // Varying HR between 50-70
      // Simple math simulation for a value
      const ecgValue = this.simulateECG(time);
      
      this.server.to(clientId).emit('vitals.update', {
        patientId,
        timestamp: Date.now(),
        ecg: ecgValue,
        spo2: 98 + Math.random() * 2 - 1, // 97-99
        heartRate: Math.round(heartRate),
      });

      time += 0.05; 
    }, 50); // 20 updates per second

    this.activeSessions.set(clientId, interval);
  }

  private stopStreaming(clientId: string) {
    if (this.activeSessions.has(clientId)) {
      clearInterval(this.activeSessions.get(clientId));
      this.activeSessions.delete(clientId);
    }
  }

  private simulateECG(t: number): number {
    // A simplified PQRST wave function approximation
    const cycle = t % (2 * Math.PI); // Not perfect logic for ECG but creates a wave
    let y = 0;
    
    // P-wave
    if (cycle > 0 && cycle < 0.5) y += 0.2 * Math.sin(cycle * 10);
    // QRS complex
    if (cycle > 0.6 && cycle < 0.8) y -= 1.0 * Math.sin(cycle * 20); // Q
    if (cycle > 0.8 && cycle < 1.0) y += 5.0 * Math.sin(cycle * 50); // R (Spike)
    if (cycle > 1.0 && cycle < 1.2) y -= 1.5 * Math.sin(cycle * 20); // S
    // T-wave
    if (cycle > 1.4 && cycle < 2.0) y += 0.4 * Math.sin(cycle * 5);

    // Baseline noise
    y += (Math.random() - 0.5) * 0.1;

    return y;
  }
}
