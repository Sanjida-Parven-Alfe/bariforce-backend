import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import session = require('express-session');
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 300000 },
    }),
  );
 
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();