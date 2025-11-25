import { authContainer } from "../di/auth.container";
import { CreateUserController } from "../controllers/create-user.controller";
import { CreateSessionController } from "../controllers/create-session.controller";

export function makeCreateUserController() {
  return new CreateUserController(authContainer.createUserUseCase);
}

export function makeCreateSessionController() {
  return new CreateSessionController(authContainer.createSessionUseCase);
}
