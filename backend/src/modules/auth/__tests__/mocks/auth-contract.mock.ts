import { IAuthContract } from '../../contract/auth-contract';
import { CreateSessionUserDto, CreateUserDto, CreateUserResponseDto, GetMeResponseDto } from '../../dto/auth-dto';

export class AuthContractMock implements IAuthContract {
  private users: Map<string, CreateSessionUserDto> = new Map();

  async createUser({
    email,
    password,
    githubPersonalAccessToken,
  }: CreateUserDto): Promise<CreateUserResponseDto> {
    const user: CreateSessionUserDto = {
      id: 'user-id-123',
      email,
      passwordHash: password,
      githubPersonalAccessToken,
    };

    this.users.set(email, user);

    return {
      id: user.id,
      email: user.email,
      githubPersonalAccessToken: user.githubPersonalAccessToken,
    };
  }

  async getUserByEmail(email: string): Promise<CreateSessionUserDto | null> {
    return this.users.get(email) || null;
  }

  async getUserById(id: string): Promise<GetMeResponseDto | null> {
    const user = Array.from(this.users.values()).find((u) => u.id === id);
    return user ? { id: user.id } : null;
  }

  async getMe(userId: string): Promise<GetMeResponseDto | null> {
    return this.getUserById(userId);
  }

  clear(): void {
    this.users.clear();
  }

  addUser(user: CreateSessionUserDto): void {
    this.users.set(user.email, user);
  }
}

