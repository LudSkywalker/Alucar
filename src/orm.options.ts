import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import TripsSeed from './trips/trips.seed';
import TripsFactory from './trips/trips.factory';
import { Rider } from './trips/entities/rider.entity';
import { Driver } from './trips/entities/driver.entity';
import { Trip } from './trips/entities/trip.entity';

ConfigModule.forRoot({
  isGlobal: true,
});

export const ormOptions: TypeOrmModuleOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  entities: [Rider, Driver, Trip],
  synchronize: false,
  logging: true,
  seeds: [TripsSeed],
  factories: [TripsFactory],
  schema: process.env.DB_SCHEMA,
};

export const dataSource = new DataSource(ormOptions as DataSourceOptions);
