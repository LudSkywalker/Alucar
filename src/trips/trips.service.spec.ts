import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Driver } from './entities/driver.entity';
import { Rider } from './entities/rider.entity';
import { HttpModule } from '@nestjs/axios';
import { ormTestOptions } from '../ormTest.options';

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsService],
      imports: [
        TypeOrmModule.forRoot(ormTestOptions),
        TypeOrmModule.forFeature([Trip, Driver, Rider]),
        HttpModule,
      ],
    }).compile();
    service = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
