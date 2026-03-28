import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { workerModule } from './worker/worker.module';
import { Worker } from './worker/worker.entity';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AdminEntity } from './admin/admin.entity';
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
    UserModule,
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',              
      port: 5432,
      username: 'postgres',
      password: '97358',               
      database: 'webtech',             
      entities: [Worker, AdminEntity], 
      synchronize: true,               
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
