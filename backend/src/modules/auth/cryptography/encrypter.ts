import { Encrypter } from "../contract/crypto-contract";
import jwt from 'jsonwebtoken';

interface JwtEncrypterOptions {
  expiresIn?: string | number;
}

export class JwtEncrypter implements Encrypter {
  constructor(
    private readonly secret: string,
    private readonly options: JwtEncrypterOptions = { expiresIn: '1d' },
  ) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, this.options as jwt.SignOptions, (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      });
    });
  }
}