import { Router } from "express";
import { makeCreateUserController, makeCreateSessionController } from "../factory/auth.factory";
import { validate } from "../../../shared/zod-validator.middleware";
import { createUserSchema, createSessionSchema } from "../validator";

const authRouter = Router();

const createUserController = makeCreateUserController();
const createSessionController = makeCreateSessionController();

authRouter.post(
  "/users",
  validate(createUserSchema),
  (req, res, next) => {
    createUserController.handle(req, res, next);
  }
);

authRouter.post(
  "/sessions",
  validate(createSessionSchema),
  (req, res, next) => {
    createSessionController.handle(req, res, next);
  }
);

export { authRouter };
