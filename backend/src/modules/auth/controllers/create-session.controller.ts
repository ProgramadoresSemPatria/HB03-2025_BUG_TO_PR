import { NextFunction, Response, Request } from "express";
import { CreateSessionUseCase } from "../use-cases";
import { JwtEncrypter } from "../cryptography/encrypter";
import { env } from "../../../config/env";

export class CreateSessionController {
  constructor(private createSession: CreateSessionUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { email, password } = request.body;

      const session = await this.createSession.execute(email, password);

      if (session.isLeft()) {
        return response.status(session.value.statusCode).json({ error: session.value.message });
      }

      const jwtEncrypter = new JwtEncrypter(env.JWT_SECRET, { expiresIn: '1d' });

      const token = await jwtEncrypter.encrypt({
        id: session.value.id,
      });

      response.status(200).json({ user: session.value, token });
    } catch (error: unknown) {
      next(error);
    }
  }
}
