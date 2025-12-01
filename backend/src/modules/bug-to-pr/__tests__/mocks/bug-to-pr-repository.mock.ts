import { IBugToPRContract, CreateGeneratedPRDto, GetHistoryFilters } from '../../contract/bug-to-pr-repository-contract';
import { GeneratePRResponseDto } from '../../dto/bug-to-pr-dto';
import { PR_STATUS } from '../../constants';

export class BugToPRRepositoryMock implements IBugToPRContract {
  private records: Map<string, GeneratePRResponseDto> = new Map();
  private nextId = 1;

  async createPR(data: CreateGeneratedPRDto): Promise<GeneratePRResponseDto> {
    const id = `pr-${this.nextId++}`;
    const record: GeneratePRResponseDto = {
      id,
      status: data.status,
      branch: data.branch,
      prUrl: data.prUrl || null,
      bugSummary: data.bugSummary,
      aiSummary: data.aiSummary || null,
      baseBranch: data.baseBranch,
      filePath: data.filePath,
      lineNumber: data.lineNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.records.set(id, record);
    return record;
  }

  async updatePR(id: string, data: Partial<CreateGeneratedPRDto>): Promise<GeneratePRResponseDto> {
    const record = this.records.get(id);
    if (!record) {
      throw new Error(`PR with id ${id} not found`);
    }

    const updated: GeneratePRResponseDto = {
      ...record,
      ...(data.status && { status: data.status }),
      ...(data.branch && { branch: data.branch }),
      ...(data.prUrl !== undefined && { prUrl: data.prUrl || null }),
      ...(data.bugSummary && { bugSummary: data.bugSummary }),
      ...(data.aiSummary !== undefined && { aiSummary: data.aiSummary || null }),
      ...(data.baseBranch && { baseBranch: data.baseBranch }),
      updatedAt: new Date(),
    };

    this.records.set(id, updated);
    return updated;
  }

  async getById(id: string): Promise<GeneratePRResponseDto | null> {
    return this.records.get(id) || null;
  }

  async getByUserId(userId: string): Promise<GeneratePRResponseDto[]> {
    return Array.from(this.records.values());
  }

  async getHistory(userId: string, filters?: GetHistoryFilters): Promise<GeneratePRResponseDto[]> {
    let records = Array.from(this.records.values());

    if (filters?.status) {
      records = records.filter(r => r.status === filters.status);
    }

    if (filters?.owner) {
      // Note: owner/repo não estão no GeneratePRResponseDto, então não podemos filtrar por eles
      // Isso é apenas para satisfazer a interface
    }

    if (filters?.repo) {
      // Note: owner/repo não estão no GeneratePRResponseDto, então não podemos filtrar por eles
      // Isso é apenas para satisfazer a interface
    }

    if (filters?.limit) {
      records = records.slice(0, filters.limit);
    }

    if (filters?.offset) {
      records = records.slice(filters.offset);
    }

    return records;
  }

  clear(): void {
    this.records.clear();
    this.nextId = 1;
  }

  getRecord(id: string): GeneratePRResponseDto | undefined {
    return this.records.get(id);
  }
}

