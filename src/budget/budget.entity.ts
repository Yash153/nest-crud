import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  timePeriod: string;

  @Column({ nullable: true })
  sector: string;
}
