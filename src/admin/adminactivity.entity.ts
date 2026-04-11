import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('admin_activities')
export class AdminActivityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => AdminEntity, admin => admin.activities)
  admin: AdminEntity;
}
