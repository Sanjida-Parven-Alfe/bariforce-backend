import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';


@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '184199',
      database: 'bariforce_db',
      entities: [UserEntity],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
