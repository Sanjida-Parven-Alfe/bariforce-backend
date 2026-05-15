import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { AdminProfileEntity } from './adminprofile.entity';
import { AdminActivityEntity } from './adminactivity.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, AdminProfileEntity, AdminActivityEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
