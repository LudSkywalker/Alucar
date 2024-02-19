import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Driver } from './entities/driver.entity';
import { Rider } from './entities/rider.entity';
import { ormTestOptions } from '../ormTest.options';
import { createDatabase, dropDatabase, runSeeders } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PaymentSystemModule, PaymentSystemService } from '@app/payment-system';

describe('TripsService', () => {
  let service: TripsService;
  let mockPaymentSystemService;

  beforeEach(async () => {
    mockPaymentSystemService = {
      addPaymentSource: jest.fn(async ({ token }) => {
        if (token == 'error') {
          throw {
            response: {
              data: { error: { type: 'INPUT_VALIDATION_ERROR' } },
            },
          };
        }
        return { data: { data: { id: 'abc123' } } };
      }),
      generateTransaction: jest.fn(({ reference }) => {
        if (reference == 'TRIP-1-0') {
          throw {
            response: {
              data: { error: { type: 'INPUT_VALIDATION_ERROR' } },
            },
          };
        }
        return {};
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsService, PaymentSystemService],
      imports: [
        TypeOrmModule.forRoot(ormTestOptions),
        TypeOrmModule.forFeature([Trip, Driver, Rider]),
        PaymentSystemModule,
      ],
    })
      .overrideProvider(PaymentSystemService)
      .useValue(mockPaymentSystemService)
      .compile();
    service = module.get<TripsService>(TripsService);

    const dataSource = new DataSource(ormTestOptions as DataSourceOptions);
    await dataSource.initialize();
    await runSeeders(dataSource);
  });

  afterEach(async () => {
    await dropDatabase({ options: ormTestOptions as DataSourceOptions });
    await createDatabase({ options: ormTestOptions as DataSourceOptions });
  });

  it('Trips service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createPayment, create and finish should work in successfully cases', async () => {
    // createPayment
    let response = await service.createPayment(1, {
      tokenized_payment: 'abc123',
      acceptance_token: 'abc123',
    });
    expect(mockPaymentSystemService.addPaymentSource).toHaveBeenCalled();
    expect(response).toHaveProperty('statusCode', 201);
    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('text');
    expect(response.message.text).toContain('successfully');

    //create
    response = await service.create(1, {
      startLocation: { latitude: 1, longitude: 1 },
      startTime: new Date(),
    });
    expect(response).toHaveProperty('statusCode', 201);
    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('text');
    expect(response.message.text).toContain('start');

    //finish
    response = await service.finish(1, {
      endLocation: { latitude: 1, longitude: 1 },
      endTime: new Date(),
    });
    expect(mockPaymentSystemService.generateTransaction).toHaveBeenCalled();
    expect(response).toHaveProperty('statusCode', 202);
    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('text');
    expect(response.message.text).toContain('finalized');
  });
  it('createPayment should work in error cases', async () => {
    // createPayment
    try {
      await service.createPayment(10000, {
        tokenized_payment: 'error',
        acceptance_token: 'error',
      });
    } catch (error) {
      expect(error.message).toBe('Rider not exist');
    }

    try {
      await service.createPayment(1, {
        tokenized_payment: 'error',
        acceptance_token: 'error',
      });
    } catch (error) {
      expect(mockPaymentSystemService.addPaymentSource).toHaveBeenCalled();
      expect(error.message).toBe('Bad Request Exception');
    }
  });

  it('create should work in error cases', async () => {
    // createPayment
    try {
      await service.create(10000, {
        startLocation: { latitude: 1, longitude: 1 },
        startTime: new Date(),
      });
    } catch (error) {
      expect(error.message).toBe('Rider not exist');
    }

    try {
      await service.create(1, {
        startLocation: { latitude: 1, longitude: 1 },
        startTime: new Date(),
      });
    } catch (error) {
      expect(error.message).toBe('Rider not have payment source');
    }

    await service.createPayment(1, {
      tokenized_payment: 'abc123',
      acceptance_token: 'abc123',
    });

    await service.create(1, {
      startLocation: { latitude: 1, longitude: 1 },
      startTime: new Date(),
    });

    try {
      await service.create(1, {
        startLocation: { latitude: 1, longitude: 1 },
        startTime: new Date(),
      });
    } catch (error) {
      expect(error.message).toBe('Rider is already on a trip');
    }
  });

  it('finish should work in error cases', async () => {
    try {
      await service.finish(10000, {
        endLocation: { latitude: 1, longitude: 1 },
        endTime: new Date(),
      });
    } catch (error) {
      expect(error.message).toBe('Driver not exist');
    }

    try {
      await service.finish(1, {
        endLocation: { latitude: 1, longitude: 1 },
        endTime: new Date(),
      });
    } catch (error) {
      expect(error.message).toBe('Driver no has pending trip');
    }

    await service.createPayment(1, {
      tokenized_payment: 'abc123',
      acceptance_token: 'abc123',
    });

    await service.create(1, {
      startLocation: { latitude: 1, longitude: 1 },
      startTime: new Date(0),
    });
    try {
      await service.finish(1, {
        endLocation: { latitude: 1, longitude: 1 },
        endTime: new Date(0),
      });
    } catch (error) {
      expect(mockPaymentSystemService.generateTransaction).toHaveBeenCalled();
      expect(error.message).toBe('Bad Request Exception');
    }
  });
});
