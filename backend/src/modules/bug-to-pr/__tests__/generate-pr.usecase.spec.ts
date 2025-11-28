import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeneratePRUseCase } from '../use-cases/generate-pr.usecase';
import { StackTraceParserMock } from './mocks/stack-trace-parser.mock';
import { GithubServiceMock } from './mocks/github-service.mock';
import { PatchServiceMock } from './mocks/patch-service.mock';
import { BugToPRRepositoryMock } from './mocks/bug-to-pr-repository.mock';
import { AuthContractMock } from '../../auth/__tests__/mocks/auth-contract.mock';
import { TokenEncrypterMock } from '../../auth/__tests__/mocks/crypto.mock';
import { InvalidStackTraceError, GithubError, PatchError } from '../errors';
import { BRANCHES, BRANCH_PREFIXES, PR_STATUS } from '../constants';
import { AIStrategyFactory } from '../strategies/ai-strategy.factory';
import { MockStrategy } from '../strategies/mock.strategy';

describe('GeneratePRUseCase', () => {
  let generatePRUseCase: GeneratePRUseCase;
  let stackTraceParserMock: StackTraceParserMock;
  let githubServiceMock: GithubServiceMock;
  let patchServiceMock: PatchServiceMock;
  let repositoryMock: BugToPRRepositoryMock;
  let authContractMock: AuthContractMock;
  let tokenEncrypterMock: TokenEncrypterMock;

  const mockDto = {
    stackTrace: 'TypeError: Cannot read property \'name\' of undefined\n    at getUserName (/helper.js:5:20)',
    owner: 'test-owner',
    repo: 'test-repo',
    branch: 'main',
    userId: 'user-123',
    aiProvider: 'gemini' as const,
  };

  const mockStackTraceInfo = {
    filePath: 'helper.js',
    lineNumber: 2,
    columnNumber: 20,
    errorMessage: 'Cannot read property \'name\' of undefined',
    errorType: 'TypeError',
  };

  const mockFileContent = {
    content: 'function getUserName(user) {\n  return user.name;\n}',
    sha: 'file-sha-123',
    path: 'helper.js',
  };

  beforeEach(() => {
    stackTraceParserMock = new StackTraceParserMock();
    githubServiceMock = new GithubServiceMock();
    patchServiceMock = new PatchServiceMock();
    repositoryMock = new BugToPRRepositoryMock();
    authContractMock = new AuthContractMock();
    tokenEncrypterMock = new TokenEncrypterMock();

    const encryptedToken = tokenEncrypterMock.encrypt('test-token');
    
    authContractMock.addUser({
      id: 'user-123',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      githubPersonalAccessToken: encryptedToken,
    });

    const mockStrategy = new MockStrategy();
    vi.spyOn(AIStrategyFactory, 'create').mockReturnValue(mockStrategy);

    generatePRUseCase = new GeneratePRUseCase(
      stackTraceParserMock,
      githubServiceMock,
      patchServiceMock,
      repositoryMock,
      authContractMock,
      tokenEncrypterMock,
    );

    stackTraceParserMock.setMockResult(mockStackTraceInfo);
    githubServiceMock.setFileContent(
      mockDto.owner,
      mockDto.repo,
      mockDto.branch,
      mockStackTraceInfo.filePath,
      mockFileContent,
    );
    patchServiceMock.setMockPatchedContent('function getUserName(user) {\n  if (!user) return null;\n  return user.name;\n}');
  });

  it('should generate PR successfully', async () => {
    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.status).toBe(PR_STATUS.SUCCESS);
      expect(result.value.branch).toContain(BRANCH_PREFIXES.AI_FIX);
      expect(result.value.prUrl).toBe('https://github.com/test-owner/test-repo/pull/1');
      expect(result.value.bugSummary).toBeDefined();
      expect(result.value.aiSummary).toBeDefined();
    }
  });

  it('should return InvalidStackTraceError when stack trace is invalid', async () => {
    stackTraceParserMock.setMockResult(null);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidStackTraceError);
      expect(result.value.statusCode).toBe(400);
    }
  });

  it('should return GithubError when file content cannot be retrieved', async () => {
    githubServiceMock.setShouldThrowOnGetFile(true);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GithubError);
      expect(result.value.statusCode).toBe(400);
    }
  });

  it('should return PatchError when AI service fails', async () => {
    const mockStrategy = new MockStrategy();
    const generatePatchSpy = vi.spyOn(mockStrategy, 'generatePatch');
    generatePatchSpy.mockRejectedValueOnce(new Error('AI service failed'));
    vi.spyOn(AIStrategyFactory, 'create').mockReturnValue(mockStrategy);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PatchError);
      expect(result.value.statusCode).toBe(400);
    }
    expect(generatePatchSpy).toHaveBeenCalled();
  });

  it('should return PatchError when patch validation fails', async () => {
    patchServiceMock.setShouldValidate(false);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PatchError);
      expect(result.value.statusCode).toBe(400);
    }
  });

  it('should return PatchError when patch application fails', async () => {
    patchServiceMock.setShouldThrowOnApply(true);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PatchError);
      expect(result.value.statusCode).toBe(400);
    }
  });

  it('should return GithubError when branch creation fails', async () => {
    githubServiceMock.setShouldThrowOnCreateBranch(true);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GithubError);
      expect(result.value.statusCode).toBe(400);
    }
  });

  it('should return GithubError when file update fails', async () => {
    githubServiceMock.setShouldThrowOnUpdateFile(true);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GithubError);
      expect(result.value.statusCode).toBe(400);
    }
  });

  it('should return GithubError when PR creation fails', async () => {
    githubServiceMock.setShouldThrowOnCreatePR(true);

    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GithubError);
      expect(result.value.statusCode).toBe(400);
    }

    const records = await repositoryMock.getByUserId(mockDto.userId!);
    const failedRecord = records.find(r => r.status === PR_STATUS.FAILED);
    expect(failedRecord).toBeDefined();
  });

  it('should create dev branch if it does not exist', async () => {
    const createBranchSpy = vi.spyOn(githubServiceMock, 'createBranch');
    const branchExistsSpy = vi.spyOn(githubServiceMock, 'branchExists');

    await generatePRUseCase.execute(mockDto);

    expect(branchExistsSpy).toHaveBeenCalledWith(
      mockDto.owner,
      mockDto.repo,
      BRANCHES.DEV,
      'test-token',
    );

    const createDevBranchCall = createBranchSpy.mock.calls.find(
      call => call[3] === BRANCHES.DEV,
    );
    expect(createDevBranchCall).toBeDefined();
  });

  it('should not create dev branch if it already exists', async () => {
    githubServiceMock.addExistingBranch(BRANCHES.DEV);
    const createBranchSpy = vi.spyOn(githubServiceMock, 'createBranch');
    const branchExistsSpy = vi.spyOn(githubServiceMock, 'branchExists');

    await generatePRUseCase.execute(mockDto);

    expect(branchExistsSpy).toHaveBeenCalledWith(
      mockDto.owner,
      mockDto.repo,
      BRANCHES.DEV,
      'test-token',
    );

    const createDevBranchCall = createBranchSpy.mock.calls.find(
      call => call[3] === BRANCHES.DEV,
    );
    expect(createDevBranchCall).toBeUndefined();
  });

  it('should create PR with dev as base branch', async () => {
    const createPRSpy = vi.spyOn(githubServiceMock, 'createPullRequest');

    await generatePRUseCase.execute(mockDto);

    expect(createPRSpy).toHaveBeenCalledWith(
      mockDto.owner,
      mockDto.repo,
      expect.stringContaining('AI Fix'),
      expect.any(String),
      expect.stringContaining(BRANCH_PREFIXES.AI_FIX),
      BRANCHES.DEV,
      'test-token',
    );
  });

  it('should create initial record with pending status', async () => {
    const createPRSpy = vi.spyOn(repositoryMock, 'createPR');

    await generatePRUseCase.execute(mockDto);

    expect(createPRSpy).toHaveBeenCalledWith({
      userId: mockDto.userId,
      status: PR_STATUS.PENDING,
      branch: PR_STATUS.PENDING,
      bugSummary: mockStackTraceInfo.errorMessage,
      stackTrace: mockDto.stackTrace,
      owner: mockDto.owner,
      repo: mockDto.repo,
      baseBranch: mockDto.branch,
      filePath: mockStackTraceInfo.filePath,
      lineNumber: mockStackTraceInfo.lineNumber,
    });
  });

  it('should update record with success status and PR URL', async () => {
    const result = await generatePRUseCase.execute(mockDto);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.status).toBe(PR_STATUS.SUCCESS);
      expect(result.value.prUrl).toBe('https://github.com/test-owner/test-repo/pull/1');
      expect(result.value.baseBranch).toBe(BRANCHES.DEV);
    }
  });

  it('should call all required services', async () => {
    const mockStrategy = new MockStrategy();
    const generatePatchSpy = vi.spyOn(mockStrategy, 'generatePatch');
    vi.spyOn(AIStrategyFactory, 'create').mockReturnValue(mockStrategy);

    const parseSpy = vi.spyOn(stackTraceParserMock, 'parse');
    const getFileContentSpy = vi.spyOn(githubServiceMock, 'getFileContent');
    const validateSpy = vi.spyOn(patchServiceMock, 'validatePatch');
    const applySpy = vi.spyOn(patchServiceMock, 'applyPatch');
    const createBranchSpy = vi.spyOn(githubServiceMock, 'createBranch');
    const updateFileSpy = vi.spyOn(githubServiceMock, 'updateFile');
    const createPRSpy = vi.spyOn(githubServiceMock, 'createPullRequest');

    await generatePRUseCase.execute(mockDto);

    expect(parseSpy).toHaveBeenCalledWith(mockDto.stackTrace);
    expect(getFileContentSpy).toHaveBeenCalled();
    expect(generatePatchSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
    expect(applySpy).toHaveBeenCalled();
    expect(createBranchSpy).toHaveBeenCalled();
    expect(updateFileSpy).toHaveBeenCalled();
    expect(createPRSpy).toHaveBeenCalled();
  });
});

