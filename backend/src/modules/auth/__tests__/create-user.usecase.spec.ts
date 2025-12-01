import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateUserUseCase } from '../use-cases/create-user.usecase';
import { AuthContractMock } from './mocks/auth-contract.mock';
import { HashGeneratorMock, TokenEncrypterMock } from './mocks/crypto.mock';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { InvalidGithubTokenError } from '../errors/invalid-github-token-error';
import { GithubTokenValidator } from '../services/github-token-validator';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let authContractMock: AuthContractMock;
  let hashGeneratorMock: HashGeneratorMock;
  let tokenEncrypterMock: TokenEncrypterMock;
  let githubTokenValidatorMock: GithubTokenValidator;

  beforeEach(() => {
    authContractMock = new AuthContractMock();
    hashGeneratorMock = new HashGeneratorMock();
    tokenEncrypterMock = new TokenEncrypterMock();
    githubTokenValidatorMock = new GithubTokenValidator();
    vi.spyOn(githubTokenValidatorMock, 'validateToken').mockResolvedValue(true);
    createUserUseCase = new CreateUserUseCase(authContractMock, hashGeneratorMock, tokenEncrypterMock, githubTokenValidatorMock);
    authContractMock.clear();
  });

  it('should create a user successfully', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'github-token-123',
    };

    const result = await createUserUseCase.execute(createUserDto);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toMatchObject({
        email: createUserDto.email,
        githubPersonalAccessToken: 'encrypted-github-token-123',
      });
      expect(result.value.id).toBeDefined();
    }
  });

  it('should hash the password before creating user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'github-token-123',
    };

    const hashSpy = vi.spyOn(hashGeneratorMock, 'hash');

    await createUserUseCase.execute(createUserDto);

    expect(hashSpy).toHaveBeenCalledWith(createUserDto.password);
    expect(hashSpy).toHaveBeenCalledTimes(1);
  });

  it('should return UserAlreadyExistsError when user already exists', async () => {
    const createUserDto = {
      email: 'existing@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'github-token-123',
    };

    await createUserUseCase.execute(createUserDto);

    const result = await createUserUseCase.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
      expect(result.value.statusCode).toBe(409);
      expect(result.value.message).toBe('User already exists');
    }
  });

  it('should call getUserByEmail to check if user exists', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'github-token-123',
    };

    const getUserByEmailSpy = vi.spyOn(authContractMock, 'getUserByEmail');

    await createUserUseCase.execute(createUserDto);

    expect(getUserByEmailSpy).toHaveBeenCalledWith(createUserDto.email);
    expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('should call createUser with hashed password and encrypted token', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'github-token-123',
    };

    const createUserSpy = vi.spyOn(authContractMock, 'createUser');
    const encryptSpy = vi.spyOn(tokenEncrypterMock, 'encrypt');

    await createUserUseCase.execute(createUserDto);

    expect(encryptSpy).toHaveBeenCalledWith(createUserDto.githubPersonalAccessToken);
    expect(createUserSpy).toHaveBeenCalledWith({
      email: createUserDto.email,
      password: 'hashed-password123',
      githubPersonalAccessToken: 'encrypted-github-token-123',
    });
    expect(createUserSpy).toHaveBeenCalledTimes(1);
  });

  it('should return InvalidGithubTokenError when GitHub token is invalid', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'invalid-token',
    };

    vi.spyOn(githubTokenValidatorMock, 'validateToken').mockResolvedValue(false);

    const result = await createUserUseCase.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidGithubTokenError);
      expect(result.value.statusCode).toBe(400);
      expect(result.value.message).toBe('Invalid GitHub personal access token');
    }
  });

  it('should validate GitHub token before creating user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      githubPersonalAccessToken: 'github-token-123',
    };

    const validateTokenSpy = vi.spyOn(githubTokenValidatorMock, 'validateToken');

    await createUserUseCase.execute(createUserDto);

    expect(validateTokenSpy).toHaveBeenCalledWith(createUserDto.githubPersonalAccessToken);
    expect(validateTokenSpy).toHaveBeenCalledTimes(1);
  });
});

