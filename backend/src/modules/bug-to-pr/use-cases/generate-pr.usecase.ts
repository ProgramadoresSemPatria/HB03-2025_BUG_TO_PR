import { Either, left, right } from '../../../@types/either';
import { IStackTraceParser } from '../contract/stack-trace-parser-contract';
import { IGithubService } from '../contract/github-contract';
import { IPatchService } from '../contract/patch-contract';
import { IBugToPRContract } from '../contract/bug-to-pr-repository-contract';
import { IAuthContract } from '../../auth/contract/auth-contract';
import { TokenEncrypter } from '../../auth/cryptography/token-encrypter';
import { GeneratePRDto, GeneratePRResponseDto } from '../dto/bug-to-pr-dto';
import { InvalidStackTraceError, GithubError, PatchError } from '../errors';
import { buildPRBody } from '../utils/build-pr';
import { BRANCHES, BRANCH_PREFIXES, PR_STATUS, COMMIT_PREFIXES } from '../constants';
import { AIStrategyFactory } from '../strategies/ai-strategy.factory';
import { AIService } from '../services/ai.service';

export class GeneratePRUseCase {
  constructor(
    private readonly stackTraceParser: IStackTraceParser,
    private readonly githubService: IGithubService,
    private readonly patchService: IPatchService,
    private readonly bugToPRContract: IBugToPRContract,
    private readonly authContract: IAuthContract,
    private readonly tokenEncrypter: TokenEncrypter,
  ) {}

  async execute(dto: GeneratePRDto): Promise<
    Either<
      InvalidStackTraceError | GithubError | PatchError,
      GeneratePRResponseDto
    >
  > {
    try {
      if (!dto.userId) {
        return left(new GithubError(400));
      }
      const user = await this.authContract.getUserWithToken(dto.userId);
      
      if (!user) {
        return left(new GithubError(400));
      }

      if (!user.githubPersonalAccessToken) {
        return left(new GithubError(400));
      }

      let githubToken: string;
      try {
        githubToken = this.tokenEncrypter.decrypt(user.githubPersonalAccessToken);
      } catch (error: any) {
        console.error('[GeneratePRUseCase] Error decrypting token:', error.message);
        return left(new GithubError(400));
      }

      const strategy = AIStrategyFactory.create(dto.aiProvider);
      const aiService = new AIService(strategy);

      const stackTraceInfo = this.stackTraceParser.parse(dto.stackTrace);
      
      if (!stackTraceInfo) {
        return left(new InvalidStackTraceError(400));
      }

      const initialRecord = await this.bugToPRContract.createPR({
        userId: dto.userId,
        status: PR_STATUS.PENDING,
        branch: PR_STATUS.PENDING,
        bugSummary: stackTraceInfo.errorMessage,
        stackTrace: dto.stackTrace,
        owner: dto.owner,
        repo: dto.repo,
        baseBranch: dto.branch,
        filePath: stackTraceInfo.filePath,
        lineNumber: stackTraceInfo.lineNumber,
      });

      let fileContent;
      try {
        fileContent = await this.githubService.getFileContent(
          dto.owner,
          dto.repo,
          dto.branch,
          stackTraceInfo.filePath,
          githubToken,
        );
      } catch (error: any) {
        return left(new GithubError(400));
      }

      let patchInfo;
      try {
        patchInfo = await aiService.analyzeErrorAndGeneratePatch(
          dto.stackTrace,
          fileContent.content,
          stackTraceInfo.filePath,
          stackTraceInfo.lineNumber,
          stackTraceInfo.errorMessage,
        );
      } catch (error: any) {
        await this.bugToPRContract.updatePR(initialRecord.id, {
          status: PR_STATUS.FAILED,
        });
        return left(new PatchError(400));
      }

      if (!this.patchService.validatePatch(patchInfo.patch)) {
        return left(new PatchError(400));
      }

      let patchedContent;
      try {
        patchedContent = this.patchService.applyPatch(
          fileContent.content,
          patchInfo.patch,
        );
      } catch (error: any) {
        return left(new PatchError(400));
      }

      const branchName = `${BRANCH_PREFIXES.AI_FIX}/${stackTraceInfo.filePath.replace(/\//g, '-')}-${Date.now()}`;
      try {
        await this.githubService.createBranch(
          dto.owner,
          dto.repo,
          dto.branch,
          branchName,
          githubToken,
        );
      } catch (error: any) {
        return left(new GithubError(400));
      }

      const commitMessage = `${COMMIT_PREFIXES.AI_FIX} ${patchInfo.bugSummary}`;
      try {
        await this.githubService.updateFile(
          dto.owner,
          dto.repo,
          branchName,
          stackTraceInfo.filePath,
          patchedContent,
          commitMessage,
          fileContent.sha,
          githubToken,
        );
      } catch (error: any) {
        return left(new GithubError(400));
      }

      const baseBranch = BRANCHES.DEV;

      const devBranchExists = await this.githubService.branchExists(
        dto.owner,
        dto.repo,
        baseBranch,
        githubToken,
      );

      if (!devBranchExists) {
        try {
          await this.githubService.createBranch(
            dto.owner,
            dto.repo,
            dto.branch,
            baseBranch,
            githubToken,
          );
        } catch (error: any) {
          await this.bugToPRContract.updatePR(initialRecord.id, {
            status: PR_STATUS.FAILED,
            branch: branchName,
          });
          return left(new GithubError(400));
        }
      }

      const prTitle = `${COMMIT_PREFIXES.AI_FIX} ${patchInfo.bugSummary}`;
      const prBody = buildPRBody(patchInfo, stackTraceInfo);
      
      let prUrl;
      try {
        prUrl = await this.githubService.createPullRequest(
          dto.owner,
          dto.repo,
          prTitle,
          prBody,
          branchName,
          baseBranch,
          githubToken,
        );
      } catch (error: any) {
        await this.bugToPRContract.updatePR(initialRecord.id, {
          status: PR_STATUS.FAILED,
          branch: branchName,
        });
        return left(new GithubError(400));
      }

      const finalRecord = await this.bugToPRContract.updatePR(initialRecord.id, {
        status: PR_STATUS.SUCCESS,
        branch: branchName,
        prUrl,
        bugSummary: patchInfo.bugSummary,
        aiSummary: patchInfo.aiSummary,
        baseBranch: baseBranch,
      });

      return right(finalRecord);
    } catch (error: any) {
      return left(new GithubError(500));
    }
  }
}
  