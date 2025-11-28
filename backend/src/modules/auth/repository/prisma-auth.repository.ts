import { PrismaClient, User } from "@prisma/client";
import { IAuthContract } from "../contract/auth-contract";
import { CreateUserDto, CreateUserResponseDto, CreateSessionUserDto, GetMeResponseDto, GetUserWithTokenDto } from "../dto/auth-dto";

export class PrismaAuthRepository implements IAuthContract {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser({
    email,
    password,
    githubPersonalAccessToken,
  }: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: password,
        githubPersonalAccessToken,
      },
    });

    return {
      id: user.id,
      email: user.email,
      githubPersonalAccessToken: user.githubPersonalAccessToken || "",
    };
  }

  async getUserByEmail(email: string): Promise<CreateSessionUserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      githubPersonalAccessToken: user.githubPersonalAccessToken || "",
    };
  }

  async getUserById(id: string): Promise<GetMeResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
    };
  }

  async getMe(userId: string): Promise<GetMeResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
    };
  }

  async getUserWithToken(userId: string): Promise<GetUserWithTokenDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      githubPersonalAccessToken: user.githubPersonalAccessToken,
    };
  }
}
