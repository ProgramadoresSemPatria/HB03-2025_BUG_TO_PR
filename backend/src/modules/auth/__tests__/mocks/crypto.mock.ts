import { HashComparer, HashGenerator } from '../../contract/crypto-contract';

export class HashGeneratorMock implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`;
  }
}

export class HashComparerMock implements HashComparer {
  private shouldMatch = true;

  async compare(plain: string, hashed: string): Promise<boolean> {
    return this.shouldMatch;
  }

  setShouldMatch(shouldMatch: boolean): void {
    this.shouldMatch = shouldMatch;
  }
}

export class BcryptHasherMock implements HashGenerator, HashComparer {
  private shouldMatch = true;

  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return this.shouldMatch;
  }

  setShouldMatch(shouldMatch: boolean): void {
    this.shouldMatch = shouldMatch;
  }
}

