import { Either, left, right } from "../../../@types/either";
import { IGithubService } from "../contract/github-contract";
import { IAuthContract } from "../../auth/contract/auth-contract";
import { TokenEncrypter } from "../../auth/cryptography/token-encrypter";
import { GithubError } from "../errors";
import { GetRepositoriesDto, GitHubRepositoryDto } from "../dto/bug-to-pr-dto";

export class GetRepositoriesUseCase {
  constructor(
    private readonly githubService: IGithubService,
    private readonly authContract: IAuthContract,
    private readonly tokenEncrypter: TokenEncrypter
  ) {}

  async execute(
    dto: GetRepositoriesDto
  ): Promise<Either<GithubError, GitHubRepositoryDto[]>> {
    try {

      const user = await this.authContract.getUserWithToken(dto.userId);

      if (!user) {
        return left(new GithubError(401));
      }

      if (!user.githubPersonalAccessToken) {
        return left(new GithubError(400));
      }

      let githubToken: string;
      try {
        githubToken = this.tokenEncrypter.decrypt(
          user.githubPersonalAccessToken
        );
      } catch (error: any) {
        return left(new GithubError(400));
      }

      const repositories = await this.githubService.getUserRepositories(
        githubToken,
        {
          type: dto.type,
          sort: dto.sort,
          direction: dto.direction,
          perPage: dto.perPage,
          page: dto.page,
        }
      );

      return right(repositories);
    } catch (error: any) {
      console.error("[GetRepositoriesUseCase] Unexpected error:", {
        message: error.message,
        stack: error.stack,
      });
      return left(new GithubError(500));
    }
  }
}
