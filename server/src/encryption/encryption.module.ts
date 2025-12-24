import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

/**
 * C15: Global Encryption Module
 */
@Global()
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
