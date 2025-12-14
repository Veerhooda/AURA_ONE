import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PatientModule } from './patient/patient.module';
import { VitalsModule } from './vitals/vitals.module';
import { NavigationModule } from './navigation/navigation.module';
import { AiModule } from './ai/ai.module';
import { EventsModule } from './events/events.module';
import { MedicationModule } from './medication/medication.module';
import { ChatModule } from './chat/chat.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    DoctorModule,
    AuthModule,
    PrismaModule,
    UsersModule,
    PatientModule,
    VitalsModule,
    NavigationModule,
    AiModule,
    EventsModule,
    MedicationModule,
    ChatModule,
    AppointmentsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} // Main Module
