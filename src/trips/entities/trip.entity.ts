import { Driver } from './driver.entity';
import { Rider } from './rider.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TripStates {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TripStates,
    default: TripStates.PENDING,
  })
  state: TripStates;

  @Column('float', { array: true })
  startLocation: [number, number];

  @Column('float', { array: true, nullable: true })
  endLocation: [number, number];

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column('timestamp with time zone', { nullable: true })
  endTime: Date;

  @ManyToOne(() => Driver, (driver) => driver.id, {
    eager: true,
  })
  driver: Driver;

  @ManyToOne(() => Rider, (rider) => rider.id, {
    eager: true,
  })
  rider: Rider;
}
