import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PatientModule } from './patient/patient.module';
import { VitalsModule } from './vitals/vitals.module';
import { NavigationModule } from './navigation/navigation.module';
import { AiModule } from './ai/ai.module';
import { EventsModule } from './events/events.module';
import { MedicationModule } from './medication/medication.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    PatientModule,
    VitalsModule,
    NavigationModule,
    AiModule,
    EventsModule,
    MedicationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} // Main Module
