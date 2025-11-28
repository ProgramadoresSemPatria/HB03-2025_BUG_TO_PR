import { CreateSessionUserDto, CreateUserDto, CreateUserResponseDto, GetMeResponseDto, GetUserWithTokenDto } from "../dto/auth-dto";

export interface IAuthContract {
  createUser: ({
    email,
    password,
    githubPersonalAccessToken,
  }: CreateUserDto) => Promise<CreateUserResponseDto>;
  getUserByEmail: (email: string) => Promise<CreateSessionUserDto | null>;
  getUserById: (id: string) => Promise<GetMeResponseDto | null>;
  getMe: (userId: string) => Promise<GetMeResponseDto | null>;
  getUserWithToken: (userId: string) => Promise<GetUserWithTokenDto | null>;
}
