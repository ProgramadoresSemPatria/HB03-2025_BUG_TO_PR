import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateSessionUseCase } from '../use-cases/create-session.usecase';
import { AuthContractMock } from './mocks/auth-contract.mock';
import { BcryptHasherMock } from './mocks/crypto.mock';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';

describe('CreateSessionUseCase', () => {
  let createSessionUseCase: CreateSessionUseCase;
  let authContractMock: AuthContractMock;
  let hashComparerMock: BcryptHasherMock;

  beforeEach(() => {
    authContractMock = new AuthContractMock();
    hashComparerMock = new BcryptHasherMock();
    createSessionUseCase = new CreateSessionUseCase(authContractMock, hashComparerMock);
    authContractMock.clear();
  });

  it('should create a session successfully with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashed-password123';

    // Add user to mock
    authContractMock.addUser({
      id: 'user-id-123',
      email,
      passwordHash: hashedPassword,
      githubPersonalAccessToken: 'github-token-123',
    });

    hashComparerMock.setShouldMatch(true);

    const result = await createSessionUseCase.execute(email, password);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toMatchObject({
        id: 'user-id-123',
        email,
        githubPersonalAccessToken: 'github-token-123',
      });
    }
  });

  it('should return InvalidCredentialsError when user does not exist', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password123';

    const result = await createSessionUseCase.execute(email, password);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidCredentialsError);
      expect(result.value.statusCode).toBe(401);
      expect(result.value.message).toBe('Invalid credentials');
    }
  });

  it('should return InvalidCredentialsError when password does not match', async () => {
    const email = 'test@example.com';
    const password = 'wrong-password';
    const hashedPassword = 'hashed-password123';

    // Add user to mock
    authContractMock.addUser({
      id: 'user-id-123',
      email,
      passwordHash: hashedPassword,
      githubPersonalAccessToken: 'github-token-123',
    });

    hashComparerMock.setShouldMatch(false);

    const result = await createSessionUseCase.execute(email, password);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidCredentialsError);
      expect(result.value.statusCode).toBe(401);
      expect(result.value.message).toBe('Invalid credentials');
    }
  });

  it('should call getUserByEmail with correct email', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashed-password123';

    authContractMock.addUser({
      id: 'user-id-123',
      email,
      passwordHash: hashedPassword,
      githubPersonalAccessToken: 'github-token-123',
    });

    hashComparerMock.setShouldMatch(true);

    const getUserByEmailSpy = vi.spyOn(authContractMock, 'getUserByEmail');

    await createSessionUseCase.execute(email, password);

    expect(getUserByEmailSpy).toHaveBeenCalledWith(email);
    expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('should call hashComparer.compare with correct parameters', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashed-password123';

    authContractMock.addUser({
      id: 'user-id-123',
      email,
      passwordHash: hashedPassword,
      githubPersonalAccessToken: 'github-token-123',
    });

    hashComparerMock.setShouldMatch(true);

    const compareSpy = vi.spyOn(hashComparerMock, 'compare');

    await createSessionUseCase.execute(email, password);

    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
    expect(compareSpy).toHaveBeenCalledTimes(1);
  });

  it('should not include passwordHash in the response', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashed-password123';

    authContractMock.addUser({
      id: 'user-id-123',
      email,
      passwordHash: hashedPassword,
      githubPersonalAccessToken: 'github-token-123',
    });

    hashComparerMock.setShouldMatch(true);

    const result = await createSessionUseCase.execute(email, password);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).not.toHaveProperty('passwordHash');
      expect(result.value).toHaveProperty('id');
      expect(result.value).toHaveProperty('email');
      expect(result.value).toHaveProperty('githubPersonalAccessToken');
    }
  });
});

