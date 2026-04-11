import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
 
@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ nullable: true })
  address: string;
 
  @Column({ nullable: true })
  phone: string;
 
  @OneToOne(() => UserEntity, user => user.profile)
  user: UserEntity;
}