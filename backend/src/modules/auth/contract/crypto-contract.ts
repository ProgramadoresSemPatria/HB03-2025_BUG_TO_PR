export interface Encrypter {
  encrypt: (payload: Record<string, unknown>) => Promise<string>;
}

export interface HashComparer {
  compare(plain: string, hashed: string): Promise<boolean>;
}

export interface HashGenerator {
  hash(plain: string): Promise<string>;
}
