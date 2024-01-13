import { Driver } from './driver.entity';
import { Rider } from './rider.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TripStates {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

let dateType: any = 'timestamptz';

if (process.env.NODE_ENV == 'test') {
  dateType = 'datetime';
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: TripStates,
    default: TripStates.PENDING,
  })
  state: TripStates;

  @Column('json')
  startLocation: [number, number];

  @Column('json', { nullable: true })
  endLocation: [number, number];

  @Column(dateType, {
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: Date;

  @Column(dateType, {
    nullable: true,
  })
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
