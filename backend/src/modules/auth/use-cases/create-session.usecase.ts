import { Either, left, right} from "../../../@types/either";
import { IAuthContract } from "../contract/auth-contract";
import { HashComparer } from "../contract/crypto-contract";
import { CreateSessionResponseDto } from "../dto/auth-dto";
import { InvalidCredentialsError } from "../errors";

export class CreateSessionUseCase {
  constructor(
    private readonly authContract: IAuthContract,
    private readonly hashComparer: HashComparer,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<Either<InvalidCredentialsError, CreateSessionResponseDto>> {
    const user = await this.authContract.getUserByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError(401));
    }

    const passwordMatch = await this.hashComparer.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return left(new InvalidCredentialsError(401));
    }
    
    const sessionResponse: CreateSessionResponseDto = {
      id: user.id,
      email: user.email,
      githubPersonalAccessToken: user.githubPersonalAccessToken,
    };
    
    return right(sessionResponse);
  }
}
