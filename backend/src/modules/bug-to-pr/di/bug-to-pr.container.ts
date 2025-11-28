import { GeneratePRUseCase } from '../use-cases/generate-pr.usecase';
import { IStackTraceParser } from '../contract/stack-trace-parser-contract';
import { IGithubService } from '../contract/github-contract';
import { IPatchService } from '../contract/patch-contract';
import { IBugToPRContract } from '../contract/bug-to-pr-repository-contract';
import { IAuthContract } from '../../auth/contract/auth-contract';
import { TokenEncrypter, getTokenEncrypter } from '../../auth/cryptography/token-encrypter';
import { StackTraceParserService } from '../services/stack-trace-parser.service';
import { GithubService } from '../services/github.service';
import { PatchService } from '../services/patch.service';
import { PrismaBugToPRRepository } from '../repository/prisma-bug-to-pr.repository';
import { PrismaAuthRepository } from '../../auth/repository/prisma-auth.repository';
import { prisma } from '../../../models/prisma.client';
import { GetRepositoriesUseCase } from '../use-cases/get-repositories.usecase';
import { GetHistoryUseCase } from '../use-cases/get-history.usecase';

class BugToPRContainer {
  _stackTraceParser: IStackTraceParser | null = null;
  _githubService: IGithubService | null = null;
  _patchService: IPatchService | null = null;
  _repository: IBugToPRContract | null = null;
  _authContract: IAuthContract | null = null;
  _tokenEncrypter: TokenEncrypter | null = null;

  get stackTraceParser(): IStackTraceParser {
    if (!this._stackTraceParser) {
      this._stackTraceParser = new StackTraceParserService();
    }
    return this._stackTraceParser;
  }

  get githubService(): IGithubService {
    if (!this._githubService) {
      this._githubService = new GithubService();
    }
    return this._githubService;
  }


  get patchService(): IPatchService {
    if (!this._patchService) {
      this._patchService = new PatchService();
    }
    return this._patchService;
  }

  get repository(): IBugToPRContract {
    if (!this._repository) {
      this._repository = new PrismaBugToPRRepository(prisma);
    }
    return this._repository;
  }

  get authContract(): IAuthContract {
    if (!this._authContract) {
      this._authContract = new PrismaAuthRepository(prisma) as IAuthContract;
    }
    return this._authContract;
  }

  get tokenEncrypter(): TokenEncrypter {
    if (!this._tokenEncrypter) {
      this._tokenEncrypter = getTokenEncrypter();
    }
    return this._tokenEncrypter;
  }

  get generatePRUseCase(): GeneratePRUseCase {
    return new GeneratePRUseCase(
      this.stackTraceParser,
      this.githubService,
      this.patchService,
      this.repository,
      this.authContract,
      this.tokenEncrypter,
    );
  }

  get getRepositoriesUseCase(): GetRepositoriesUseCase {
    return new GetRepositoriesUseCase(
      this.githubService,
      this.authContract,
      this.tokenEncrypter,
    );
  }

  get getHistoryUseCase(): GetHistoryUseCase {
    return new GetHistoryUseCase(this.repository);
  }
}

export const bugToPRContainer = new BugToPRContainer();

