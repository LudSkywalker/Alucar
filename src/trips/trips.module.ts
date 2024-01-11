import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Driver } from './entities/driver.entity';
import { Rider } from './entities/rider.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Driver, Rider]), HttpModule],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
