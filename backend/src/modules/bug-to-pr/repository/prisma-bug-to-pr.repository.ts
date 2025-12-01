import { PrismaClient } from '@prisma/client';
import { IBugToPRContract, CreateGeneratedPRDto, GetHistoryFilters } from '../contract/bug-to-pr-repository-contract';
import { GeneratePRResponseDto } from '../dto/bug-to-pr-dto';

export class PrismaBugToPRRepository implements IBugToPRContract {
  constructor(private readonly prisma: PrismaClient) {}

  async createPR(data: CreateGeneratedPRDto): Promise<GeneratePRResponseDto> {
    const generatedPR = await this.prisma.generatedPR.create({
      data: {
        userId: data.userId,
        status: data.status,
        branch: data.branch,
        prUrl: data.prUrl,
        bugSummary: data.bugSummary,
        aiSummary: data.aiSummary,
        stackTrace: data.stackTrace,
        owner: data.owner,
        repo: data.repo,
        baseBranch: data.baseBranch,
        filePath: data.filePath,
        lineNumber: data.lineNumber,
      },
    });

    return this.mapToResponseDto(generatedPR);
  }

  async getById(id: string): Promise<GeneratePRResponseDto | null> {
    const generatedPR = await this.prisma.generatedPR.findUnique({
      where: { id },
    });

    if (!generatedPR) {
      return null;
    }

    return this.mapToResponseDto(generatedPR);
  }

  async updatePR(id: string, data: Partial<CreateGeneratedPRDto>): Promise<GeneratePRResponseDto> {
    const updated = await this.prisma.generatedPR.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.branch && { branch: data.branch }),
        ...(data.prUrl !== undefined && { prUrl: data.prUrl }),
        ...(data.bugSummary && { bugSummary: data.bugSummary }),
        ...(data.aiSummary !== undefined && { aiSummary: data.aiSummary }),
        ...(data.baseBranch && { baseBranch: data.baseBranch }),
      },
    });

    return this.mapToResponseDto(updated);
  }

  async getByUserId(userId: string): Promise<GeneratePRResponseDto[]> {
    const generatedPRs = await this.prisma.generatedPR.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return generatedPRs.map(this.mapToResponseDto);
  }

  async getHistory(userId: string, filters?: GetHistoryFilters): Promise<GeneratePRResponseDto[]> {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.owner) {
      where.owner = filters.owner;
    }

    if (filters?.repo) {
      where.repo = filters.repo;
    }

    const generatedPRs = await this.prisma.generatedPR.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return generatedPRs.map(this.mapToResponseDto);
  }

  private mapToResponseDto(pr: any): GeneratePRResponseDto {
    return {
      id: pr.id,
      status: pr.status,
      branch: pr.branch,
      prUrl: pr.prUrl,
      bugSummary: pr.bugSummary,
      aiSummary: pr.aiSummary,
      baseBranch: pr.baseBranch,
      filePath: pr.filePath,
      lineNumber: pr.lineNumber,
      createdAt: pr.createdAt,
      updatedAt: pr.updatedAt,
    };
  }
}

