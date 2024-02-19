import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Driver } from './entities/driver.entity';
import { Rider } from './entities/rider.entity';
import { ormTestOptions } from '../ormTest.options';

describe('TripsController', () => {
  let controller: TripsController;
  let mockTripService;

  beforeEach(async () => {
    mockTripService = {
      createPayment: jest.fn(() => {
        return {
          statusCode: 201,
          message: { text: 'Payment source successfully register' },
        };
      }),
      create: jest.fn(() => {
        return {
          statusCode: 201,
          message: {
            text: 'Trip start successfully',
            driver: { id: 1, name: 'Beenom' },
          },
        };
      }),
      finish: jest.fn(() => {
        return {
          statusCode: 202,
          message: {
            text: 'Trip finalized with successfully payment',
            amount: {},
            finalPriceCent: 100,
          },
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [TripsService],
      imports: [
        TypeOrmModule.forRoot(ormTestOptions),
        TypeOrmModule.forFeature([Trip, Driver, Rider]),
        HttpModule,
      ],
    })
      .overrideProvider(TripsService)
      .useValue(mockTripService)
      .compile();

    controller = module.get<TripsController>(TripsController);
  });

  it('Trips controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST createPayment should work', async () => {
    const response = await controller.createPayment(1, {
      tokenized_payment: 'abc123',
      acceptance_token: 'abc123',
    });
    expect(mockTripService.createPayment).toHaveBeenCalled();
    expect(response).toHaveProperty('statusCode', 201);
    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('text');
    expect(response.message.text).toContain('successfully');
  });

  it('POST create should work', async () => {
    const res = { status: jest.fn((st) => st) };
    const response = await controller.create(
      1,
      {
        startLocation: { latitude: 1, longitude: 1 },
        startTime: new Date(),
      },
      res,
    );
    expect(mockTripService.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(response).toHaveProperty('statusCode', 201);
    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('text');
    expect(response.message.text).toContain('start');
  });

  it('DELETE finish should work', async () => {
    const res = { status: jest.fn((st) => st) };
    const response = await controller.finish(
      1,
      {
        endLocation: { latitude: 1, longitude: 1 },
        endTime: new Date(),
      },
      res,
    );
    expect(mockTripService.finish).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(response).toHaveProperty('statusCode', 202);
    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('text');
    expect(response.message.text).toContain('finalized');
  });
});
