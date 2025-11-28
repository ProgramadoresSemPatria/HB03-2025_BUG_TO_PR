import { bugToPRContainer } from '../di/bug-to-pr.container';
import { GeneratePRController } from '../controllers/generate-pr.controller';
import { GetRepositoriesController } from '../controllers/get-repositories.controller';
import { GetHistoryController } from '../controllers/get-history.controller';

export function makeGeneratePRController() {
  return new GeneratePRController(bugToPRContainer.generatePRUseCase);
}

export function makeGetRepositoriesController(): GetRepositoriesController {
  return new GetRepositoriesController(
    bugToPRContainer.getRepositoriesUseCase
  );
}

export function makeGetHistoryController(): GetHistoryController {
  return new GetHistoryController(bugToPRContainer.getHistoryUseCase);
}