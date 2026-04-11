import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserProfileEntity } from './userprofile.entity';
import { BookingEntity } from './booking.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity, BookingEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}