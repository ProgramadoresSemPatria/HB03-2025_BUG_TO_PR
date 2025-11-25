import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on :${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
});

