import { Either, left, right } from '../../../@types/either';
import { IBugToPRContract, GetHistoryFilters } from '../contract/bug-to-pr-repository-contract';
import { GeneratePRResponseDto, GetHistoryDto } from '../dto/bug-to-pr-dto';
import { UnauthorizedError } from '../../auth/errors';

export class GetHistoryUseCase {
  constructor(
    private readonly bugToPRContract: IBugToPRContract,
  ) {}

  async execute(
    dto: GetHistoryDto
  ): Promise<Either<UnauthorizedError, GeneratePRResponseDto[]>> {
    if (!dto.userId) {
      return left(new UnauthorizedError(401));
    }

    const filters: GetHistoryFilters = {
      status: dto.status,
      owner: dto.owner,
      repo: dto.repo,
      limit: dto.limit,
      offset: dto.offset,
    };

    const history = await this.bugToPRContract.getHistory(dto.userId, filters);

    return right(history);
  }
}

