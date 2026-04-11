import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn ,BeforeInsert ,Check} from 'typeorm';

@Entity()
@Check(`"phone" > 0`) 
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  fullname: string;

  /*@Column({ name: 'full_name', nullable: true })
  fullName: string
   @Column({ unique: true })
  email: string;
  @Column({ type: 'varchar', length: 50 })
  name: string;
  ;*/
  
  @Column({ type: 'bigint', unsigned: true })
  phone: string;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(Math.random() * 100);
  }
}