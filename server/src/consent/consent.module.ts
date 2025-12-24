import { Module, Global } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * C14: Global Consent Module
 * Available throughout the application for consent checks
 */
@Global()
@Module({
  imports: [PrismaModule],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
