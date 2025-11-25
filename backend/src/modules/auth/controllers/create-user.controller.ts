import { NextFunction, Request, Response } from "express";
import { CreateUserUseCase } from "../use-cases";

export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, githubPersonalAccessToken } = request.body;

      const user = await this.createUser.execute({
        email,
        password,
        githubPersonalAccessToken,
      });

      if (user.isLeft()) {
        return response.status(user.value.statusCode).json({ error: user.value.message });
      }

      return response.status(201).json(user.value);
    } catch (error: unknown) {
      next(error);
    }
  }
}
