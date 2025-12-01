import { Either, left, right } from "../../../@types/either";
import { IAuthContract } from "../contract/auth-contract";
import { HashGenerator } from "../contract/crypto-contract";
import { CreateUserDto, CreateUserResponseDto } from "../dto/auth-dto";
import { UserAlreadyExistsError, InvalidGithubTokenError } from "../errors";
import { TokenEncrypter } from "../cryptography/token-encrypter";
import { GithubTokenValidator } from "../services/github-token-validator";

export class CreateUserUseCase {
  constructor(
    private readonly authContract: IAuthContract,
    private readonly hashGenerator: HashGenerator,
    private readonly tokenEncrypter: TokenEncrypter,
    private readonly githubTokenValidator: GithubTokenValidator
  ) {}

  async execute({
    email,
    password,
    githubPersonalAccessToken,
  }: CreateUserDto): Promise<Either<UserAlreadyExistsError | InvalidGithubTokenError, CreateUserResponseDto>> {
    const user = await this.authContract.getUserByEmail(email);

    if (user) {
      return left(new UserAlreadyExistsError(409));
    }

    if (githubPersonalAccessToken) {
      const isValidToken = await this.githubTokenValidator.validateToken(githubPersonalAccessToken);
      if (!isValidToken) {
        return left(new InvalidGithubTokenError(400));
      }
    }

    const passwordHash = await this.hashGenerator.hash(password);
    
    const encryptedToken = githubPersonalAccessToken
      ? this.tokenEncrypter.encrypt(githubPersonalAccessToken)
      : undefined;

    const createdUser = await this.authContract.createUser({
      email,
      password: passwordHash,
      githubPersonalAccessToken: encryptedToken!,
    });

    return right(createdUser);
  }
}
