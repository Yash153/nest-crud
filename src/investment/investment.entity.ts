import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  amount: number;

  @Column()
  sector: string;
}
