import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('admin_profiles')
export class AdminProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @OneToOne(() => AdminEntity, admin => admin.profile)
  admin: AdminEntity;
}
