import express, { Application } from 'express';
import { bindRoutes } from './routes/bind-routes';

const app: Application = express();

bindRoutes(app);

export default app;