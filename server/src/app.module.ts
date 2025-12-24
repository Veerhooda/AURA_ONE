import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PatientModule } from './patient/patient.module';
import { VitalsModule } from './vitals/vitals.module';
import { AiModule } from './ai/ai.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuditModule } from './audit/audit.module';
import { CareModule } from './care/care.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DoctorModule,
    AuthModule,
    PrismaModule,
    UsersModule,
    PatientModule,
    VitalsModule,
    AiModule,
    EventsModule,
    ChatModule,
    AppointmentsModule,
    AuditModule,
    CareModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
