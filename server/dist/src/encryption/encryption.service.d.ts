export declare class EncryptionService {
    private algorithm;
    private keyLength;
    private ivLength;
    private tagLength;
    private getKey;
    encrypt(plaintext: string): string;
    decrypt(encrypted: string): string;
    isEncrypted(data: string): boolean;
}
