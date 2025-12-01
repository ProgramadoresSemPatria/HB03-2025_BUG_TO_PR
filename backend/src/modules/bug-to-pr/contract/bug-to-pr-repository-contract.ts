import { GeneratePRResponseDto } from '../dto/bug-to-pr-dto';
import { PRStatus } from '../constants';

export interface CreateGeneratedPRDto {
  userId?: string;
  status: PRStatus;
  branch: string;
  prUrl?: string;
  bugSummary: string;
  aiSummary?: string;
  stackTrace: string;
  owner: string;
  repo: string;
  baseBranch: string;
  filePath: string;
  lineNumber: number;
}

export interface GetHistoryFilters {
  status?: string;
  owner?: string;
  repo?: string;
  limit?: number;
  offset?: number;
}

export interface IBugToPRContract{
  createPR(data: CreateGeneratedPRDto): Promise<GeneratePRResponseDto>;
  updatePR(id: string, data: Partial<CreateGeneratedPRDto>): Promise<GeneratePRResponseDto>;
  getById(id: string): Promise<GeneratePRResponseDto | null>;
  getByUserId(userId: string): Promise<GeneratePRResponseDto[]>;
  getHistory(userId: string, filters?: GetHistoryFilters): Promise<GeneratePRResponseDto[]>;
}

