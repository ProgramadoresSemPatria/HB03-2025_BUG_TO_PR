import * as crypto from 'crypto';
import { env } from '../../../config/env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export interface TokenEncrypter {
  encrypt(plaintext: string): string;
  decrypt(encrypted: string): string;
}

export class AESTokenEncrypter implements TokenEncrypter {
  private readonly key: Buffer;

  constructor(encryptionKey: string) {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
    }
    this.key = crypto.scryptSync(encryptionKey, 'salt', KEY_LENGTH);
  }

  encrypt(plaintext: string): string {
    if (!plaintext) {
      return plaintext;
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  }

  decrypt(encrypted: string): string {
    if (!encrypted) {
      return encrypted;
    }

    const parts = encrypted.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }

    const [ivHex, tagHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

let tokenEncrypterInstance: TokenEncrypter | null = null;

export function getTokenEncrypter(): TokenEncrypter {
  if (!tokenEncrypterInstance) {
    if (!env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    tokenEncrypterInstance = new AESTokenEncrypter(env.ENCRYPTION_KEY);
  }
  return tokenEncrypterInstance;
}

