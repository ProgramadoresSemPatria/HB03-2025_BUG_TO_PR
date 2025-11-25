import { PrismaClient, User } from "@prisma/client";
import { IAuthContract } from "../contract/auth-contract";
import { CreateUserDto } from "../dto/auth-dto";

export class PrismaAuthRepository implements IAuthContract {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser({
    email,
    password,
    githubPersonalAccessToken,
  }: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: password,
        githubPersonalAccessToken,
      },
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async getMe(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  }
}
