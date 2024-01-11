import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class Rider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  paymentSourceID?: string;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: [Trip];
}
