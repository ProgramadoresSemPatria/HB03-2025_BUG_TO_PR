import { NextFunction, Request, Response } from 'express';
import { GetHistoryUseCase } from '../use-cases/get-history.usecase';
import { PRStatus } from '../constants';

export class GetHistoryController {
  constructor(private getHistory: GetHistoryUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.user?.id || request.userId;
      const { status, owner, repo, limit, offset } = request.query;

      const result = await this.getHistory.execute({
        userId: userId!,
        status: status as PRStatus | undefined,
        owner: owner as string | undefined,
        repo: repo as string | undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      if (result.isLeft()) {
        const error = result.value;
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      return response.status(200).json({ history: result.value });
    } catch (error: unknown) {
      next(error);
    }
  }
}

