import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AdminProfileEntity } from './adminprofile.entity';
import { AdminActivityEntity } from './adminactivity.entity';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unsigned: true })
  age: number;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @OneToOne(() => AdminProfileEntity, profile => profile.admin, { cascade: true })
  @JoinColumn()
  profile: AdminProfileEntity;

  @OneToMany(() => AdminActivityEntity, activity => activity.admin, { cascade: true })
  activities: AdminActivityEntity[];
}
