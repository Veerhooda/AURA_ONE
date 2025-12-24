import { Module } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { VitalsController } from './vitals.controller';
import { VitalsValidationService } from './vitals-validation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VitalsService, VitalsValidationService],
  controllers: [VitalsController],
  exports: [VitalsService, VitalsValidationService],
})
export class VitalsModule {}
