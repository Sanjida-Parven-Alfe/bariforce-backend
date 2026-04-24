/*import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Worker } from './worker.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: number;

  @Column()
  customerId: number;
   
  @Column()
  workerId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text', nullable: true })
  reply: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Worker, (worker) => worker.reviews)
  worker: Worker;
}*/