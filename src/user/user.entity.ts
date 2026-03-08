import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn() 
  id: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 150 }) 
  fullName: string;

  @Column({ default: false })
  isActive: boolean;

  @BeforeInsert()
  generateId() {
   
    this.id = 'USER-' + Math.floor(Math.random() * 10000);
  }
}