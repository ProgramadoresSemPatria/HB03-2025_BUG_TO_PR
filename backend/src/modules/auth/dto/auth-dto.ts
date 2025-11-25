export interface CreateUserDto {
    email: string;
    password: string;
    githubPersonalAccessToken: string;
}

export interface CreateSessionDto {
    email: string;
    password: string;
}

export interface CreateSessionUserDto {
    id: string;
    email: string;
    passwordHash: string;
    githubPersonalAccessToken: string;
}

export interface CreateUserResponseDto {
    id: string;
    email: string;
    githubPersonalAccessToken: string;
}

export interface CreateSessionResponseDto {
    id: string;
    email: string;
    githubPersonalAccessToken: string;
}

export interface GetMeResponseDto {
    id: string;
}