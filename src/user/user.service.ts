import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; // Like ইম্পোর্ট নিশ্চিত করো
import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  
  async createAccount(data: UserDTO): Promise<UserEntity> {
    return await this.userRepo.save(data);
  }

  
  async searchByFullName(namePart: string): Promise<UserEntity[]> {
    return await this.userRepo.find({
      where: { fullName: Like(`%${namePart}%`) },
    });
  }

  
 async findByNameSubstring(namePart: string): Promise<UserEntity[]> {
    return await this.userRepo.find({
      where: { 
        fullName: Like(`%${namePart}%`) 
      },
    });
  }
  async findByUsername(uname: string): Promise<UserEntity | null> {
    return await this.userRepo.findOneBy({ username: uname });
  }
  
  async removeByUsername(uname: string): Promise<any> {
    return await this.userRepo.delete({ username: uname });
  }

  
  uploadDocument(filename: string) {
    return { message: 'Uploaded', file: filename };
  }
}