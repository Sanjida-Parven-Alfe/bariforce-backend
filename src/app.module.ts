import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { workerModule } from './worker/worker.module';
import { Worker } from './worker/worker.entity';

/*
@Module({
  imports: [workerModule],
  controllers: [],
  providers: [],
})
   /*entities: [Worker],
export class AppModule { } */

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '97358',
      database: 'webtech',
      autoLoadEntities: true,
      synchronize: true,
    }),
    workerModule,
  ],
})
export class AppModule {}
