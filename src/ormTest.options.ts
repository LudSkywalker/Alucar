import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Trip } from './trips/entities/trip.entity';
import { Driver } from './trips/entities/driver.entity';
import { Rider } from './trips/entities/rider.entity';
import TripsSeed from './trips/trips.seed';
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';

export const ormTestOptions: TypeOrmModuleOptions & SeederOptions = {
  type: 'better-sqlite3',
  database: 'test/test.db',
  dropSchema: true,
  entities: [Trip, Driver, Rider],
  seeds: [TripsSeed],
  logging: false,
  synchronize: true,
};

export const dataSource = new DataSource(ormTestOptions as DataSourceOptions);
