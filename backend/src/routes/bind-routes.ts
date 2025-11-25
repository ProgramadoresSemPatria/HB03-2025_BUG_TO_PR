import express, { Application, Router, Response, Request } from "express";
import { errorHandler } from "../shared/error-handler";
import cors from "cors";
import { authRouter } from "../modules/auth/routes/auth.routes";

export const bindRoutes = (app: Application) => {
  app.use(cors());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const appRoutes = Router();
  appRoutes.get('/health', (_: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  appRoutes.use('/auth', authRouter);
  app.use('/api/v1', appRoutes);
  app.use(errorHandler);
}

export default bindRoutes;