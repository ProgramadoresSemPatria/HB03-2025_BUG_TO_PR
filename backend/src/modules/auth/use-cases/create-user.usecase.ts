import { Either, left, right } from "../../../@types/either";
import { IAuthContract } from "../contract/auth-contract";
import { HashGenerator } from "../contract/crypto-contract";
import { CreateUserDto, CreateUserResponseDto } from "../dto/auth-dto";
import { UserAlreadyExistsError } from "../errors";

export class CreateUserUseCase {
  constructor(
    private readonly authContract: IAuthContract,
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    password,
    githubPersonalAccessToken,
  }: CreateUserDto): Promise<Either<UserAlreadyExistsError, CreateUserResponseDto>> {
    const user = await this.authContract.getUserByEmail(email);

    if (user) {
      return left(new UserAlreadyExistsError(409));
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const createdUser = await this.authContract.createUser({
      email,
      password: passwordHash,
      githubPersonalAccessToken,
    });

    return right(createdUser);
  }
}
