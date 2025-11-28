import express, { Application, Router, Response, Request } from "express";
import { errorHandler } from "../shared/error-handler";
import cors from "cors";
import { authRouter } from "../modules/auth/routes/auth.routes";
import { bugToPRRouter } from "../modules/bug-to-pr/routes/bug-to-pr.routes";
import { authenticate } from "../modules/auth/middleware";

export const bindRoutes = (app: Application) => {
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  
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
  appRoutes.use(authenticate);
  appRoutes.use('/bug-to-pr', bugToPRRouter);
  app.use('/api/v1', appRoutes);
  app.use(errorHandler);
}

export default bindRoutes;