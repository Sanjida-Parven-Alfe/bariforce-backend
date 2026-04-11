import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
 
@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  serviceName: string;
 
  @Column({ default: 'pending' })
  status: string;
 
  @ManyToOne(() => UserEntity, user => user.bookings)
  user: UserEntity;
}