import { NextFunction, Request, Response } from 'express';
import { GeneratePRUseCase } from '../use-cases';

export class GeneratePRController {
  constructor(private generatePR: GeneratePRUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { stackTrace, owner, repo, branch, aiProvider } = request.body;
      const userId = request.user?.id || request.userId;

      const result = await this.generatePR.execute({
        stackTrace,
        owner,
        repo,
        branch,
        userId,
        aiProvider,
      });

      if (result.isLeft()) {
        const error = result.value;
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      const responseData = {
        status: result.value.status,
        branch: result.value.branch,
        prUrl: result.value.prUrl,
        bugSummary: result.value.bugSummary,
        aiSummary: result.value.aiSummary,
        filePath: result.value.filePath,
        lineNumber: result.value.lineNumber,
      };

      return response.status(201).json(responseData);
    } catch (error: unknown) {
      next(error);
    }
  }
}

