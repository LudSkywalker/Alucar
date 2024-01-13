import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class Rider {
  @Column({ primary: true, generated: !(process.env.NODE_ENV == 'test') })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  paymentSourceID?: string;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: [Trip];
}
