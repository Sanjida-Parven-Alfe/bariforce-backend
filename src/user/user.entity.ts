import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserProfileEntity } from './userprofile.entity';
import { BookingEntity } from './booking.entity';
 
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
 
  @Column({ length: 100 })
  name: string;
 
  @Column({ unique: true })
  email: string;
 
  @Column()
  password: string;
 
  @OneToOne(() => UserProfileEntity, profile => profile.user, { cascade: true })
  @JoinColumn()
  profile: UserProfileEntity;
 
  @OneToMany(() => BookingEntity, booking => booking.user, { cascade: true })
  bookings: BookingEntity[];
}