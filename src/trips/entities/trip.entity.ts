import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Driver } from './driver.entity';
import { Rider } from './rider.entity';

enum TripStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PENDING,
  })
  state: TripStatus;

  @Column('point', { array: true })
  startLocation: [number, number];

  @Column('point', { array: true, nullable: true })
  endLocation: [number, number];

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column('timestamp', { nullable: true })
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
