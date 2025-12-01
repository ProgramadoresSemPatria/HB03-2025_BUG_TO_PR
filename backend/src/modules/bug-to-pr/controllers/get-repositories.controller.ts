import { NextFunction, Request, Response } from 'express';
import { GetRepositoriesUseCase } from '../use-cases/get-repositories.usecase';

export class GetRepositoriesController {
  constructor(private getRepositories: GetRepositoriesUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.user?.id || request.userId;
      const { type, sort, direction, perPage, page } = request.query;

      const result = await this.getRepositories.execute({
        userId: userId!,
        type: type as 'all' | 'owner' | 'member' | undefined,
        sort: sort as 'created' | 'updated' | 'pushed' | 'full_name' | undefined,
        direction: direction as 'asc' | 'desc' | undefined,
        perPage: perPage ? Number(perPage) : undefined,
        page: page ? Number(page) : undefined,
      });

      if (result.isLeft()) {
        const error = result.value;
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      return response.status(200).json({ repositories: result.value });
    } catch (error: unknown) {
      console.error("[GetRepositoriesController] Unexpected error:", error);
      next(error);
    }
  }
}