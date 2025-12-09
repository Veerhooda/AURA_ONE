import { Module } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { VitalsController } from './vitals.controller';

@Module({
  providers: [VitalsService],
  controllers: [VitalsController]
})
export class VitalsModule {}
