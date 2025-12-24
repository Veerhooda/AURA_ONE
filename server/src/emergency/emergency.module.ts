import { Module, Global } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [EmergencyService],
  exports: [EmergencyService],
})
export class EmergencyModule {}
