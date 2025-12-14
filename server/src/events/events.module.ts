import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
  providers: [EventsGateway],
})
export class EventsModule {}
