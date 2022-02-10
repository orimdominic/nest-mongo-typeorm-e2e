import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'test') {
    // to trigger MongoMemoryServer to shutdown on triggering app.close per test
    app.enableShutdownHooks();
  }
  await app.listen(3000);
}
bootstrap();
