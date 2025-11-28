import { Router } from 'express';
import { makeGeneratePRController, makeGetRepositoriesController, makeGetHistoryController } from '../factory/bug-to-pr.factory';
import { validate } from '../../../shared/zod-validator.middleware';
import { generatePRSchema } from '../validator/generate-pr.validator';

const bugToPRRouter = Router();

const generatePRController = makeGeneratePRController();
const getRepositoriesController = makeGetRepositoriesController();
const getHistoryController = makeGetHistoryController();

bugToPRRouter.post(
  '/generate',
  validate(generatePRSchema),
  (req, res, next) => {
    generatePRController.handle(req, res, next);
  }
);

bugToPRRouter.get(
  '/repositories',
  (req, res, next) => {
    getRepositoriesController.handle(req, res, next);
  }
);

bugToPRRouter.get(
  '/history',
  (req, res, next) => {
    getHistoryController.handle(req, res, next);
  }
);

export { bugToPRRouter };

