import { Module } from '@nestjs/common';
import { CareController } from './care.controller';
import { CareService } from './care.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CareController],
  providers: [CareService, PrismaService],
  exports: [CareService]
})
export class CareModule {}
