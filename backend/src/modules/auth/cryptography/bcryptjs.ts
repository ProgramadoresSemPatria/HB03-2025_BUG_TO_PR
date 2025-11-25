import { HashComparer, HashGenerator } from '../contract/crypto-contract';

export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_LENGTH = 10;

  async hash(plain: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(plain, hashed);
  }
}