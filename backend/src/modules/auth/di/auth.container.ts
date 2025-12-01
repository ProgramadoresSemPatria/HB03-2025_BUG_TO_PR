
import { CreateSessionUseCase } from "../use-cases/create-session.usecase";
import { CreateUserUseCase } from "../use-cases/create-user.usecase";
import { IAuthContract } from "../contract/auth-contract";
import { BcryptHasher } from "../cryptography/bcryptjs";
import { TokenEncrypter, getTokenEncrypter } from "../cryptography/token-encrypter";
import { PrismaAuthRepository } from "../repository/prisma-auth.repository";
import { prisma } from "../../../models/prisma.client";
import { GithubTokenValidator } from "../services/github-token-validator";

class AuthContainer {
  _repository: IAuthContract | null = null;
  _hashService: BcryptHasher | null = null;
  _tokenEncrypter: TokenEncrypter | null = null;
  _githubTokenValidator: GithubTokenValidator | null = null;

  get repository(): IAuthContract {
    if (!this._repository) {
      this._repository = new PrismaAuthRepository(prisma) as IAuthContract;
    }
    return this._repository;
  }

  get hashService(): BcryptHasher {
    if (!this._hashService) {
      this._hashService = new BcryptHasher();
    }
    return this._hashService;
  }

  get tokenEncrypter(): TokenEncrypter {
    if (!this._tokenEncrypter) {
      this._tokenEncrypter = getTokenEncrypter();
    }
    return this._tokenEncrypter;
  }

  get githubTokenValidator(): GithubTokenValidator {
    if (!this._githubTokenValidator) {
      this._githubTokenValidator = new GithubTokenValidator();
    }
    return this._githubTokenValidator;
  }

  get createSessionUseCase(): CreateSessionUseCase {
    return new CreateSessionUseCase(this.repository, this.hashService);
  }

  get createUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(this.repository, this.hashService, this.tokenEncrypter, this.githubTokenValidator);
  }
}

export const authContainer = new AuthContainer();