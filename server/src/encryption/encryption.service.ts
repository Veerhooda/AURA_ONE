import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * C15: Encryption Service for sensitive data at rest
 * Uses AES-256-GCM for field-level encryption
 */
@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private keyLength = 32; // 256 bits
  private ivLength = 16;  // 128 bits
  private tagLength = 16; // 128 bits

  /**
   * Get encryption key from environment
   * In production, this should come from a secure vault (AWS KMS, HashiCorp Vault, etc.)
   */
  private getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable not set');
    }

    if (key.length !== 64) { // 32 bytes = 64 hex chars
      throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
    }

    return Buffer.from(key, 'hex');
  }

  /**
   * Encrypt a string
   * Returns: iv:tag:ciphertext (all hex-encoded)
   */
  encrypt(plaintext: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(this.ivLength);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as crypto.CipherGCM;
    
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Format: iv:tag:ciphertext
    return `${iv.toString('hex')}:${tag.toString('hex')}:${ciphertext}`;
  }

  /**
   * Decrypt a string
   * Input format: iv:tag:ciphertext (all hex-encoded)
   */
  decrypt(encrypted: string): string {
    const key = this.getKey();
    const parts = encrypted.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const ciphertext = parts[2];

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(tag);

    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
  }

  /**
   * Check if a string is encrypted (has the iv:tag:ciphertext format)
   */
  isEncrypted(data: string): boolean {
    const parts = data.split(':');
    return parts.length === 3 && 
           parts[0].length === this.ivLength * 2 &&
           parts[1].length === this.tagLength * 2;
  }
}
