
import { CreateSessionUseCase } from "../use-cases/create-session.usecase";
import { CreateUserUseCase } from "../use-cases/create-user.usecase";
import { IAuthContract } from "../contract/auth-contract";
import { BcryptHasher } from "../cryptography/bcryptjs";
import { PrismaAuthRepository } from "../repository/prisma-auth.repository";
import { prisma } from "../../../models/prisma.client";

class AuthContainer {
  _repository: IAuthContract | null = null;
  _hashService: BcryptHasher | null = null;

  get repository(): IAuthContract {
    if (!this._repository) {
      this._repository = new PrismaAuthRepository(prisma);
    }
    return this._repository;
  }

  get hashService(): BcryptHasher {
    if (!this._hashService) {
      this._hashService = new BcryptHasher();
    }
    return this._hashService;
  }

  get createSessionUseCase(): CreateSessionUseCase {
    return new CreateSessionUseCase(this.repository, this.hashService);
  }

  get createUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(this.repository, this.hashService);
  }
}

export const authContainer = new AuthContainer();