import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class Driver {
  @Column({ primary: true, generated: !(process.env.NODE_ENV == 'test') })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: [Trip];
}
