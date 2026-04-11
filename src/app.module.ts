import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserEntity } from './user/user.entity';
import { UserProfileEntity } from './user/userprofile.entity';
import { BookingEntity } from './user/booking.entity';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'youremail@gmail.com',
          pass: 'yourpassword',
        },
      },
    }),
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: 'bariforce_db',
      entities: [
        UserEntity,
        UserProfileEntity,
        BookingEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
 
 