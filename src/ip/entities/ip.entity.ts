import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  fecha: string;
}

