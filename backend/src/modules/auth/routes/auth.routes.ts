import { Router } from "express";
import { makeCreateUserController, makeCreateSessionController } from "../factory/auth.factory";

const authRouter = Router();

const createUserController = makeCreateUserController();
const createSessionController = makeCreateSessionController();

authRouter.post("/users", (req, res, next) => {
  createUserController.handle(req, res, next);
});

authRouter.post("/sessions", (req, res, next) => {
  createSessionController.handle(req, res, next);
});

export { authRouter };
