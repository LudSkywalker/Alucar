import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ormTestOptions } from '../src/ormTest.options';
import { createDatabase, dropDatabase, runSeeders } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const httpService = new HttpService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const dataSource = new DataSource(ormTestOptions as DataSourceOptions);
    await dataSource.initialize();
    await runSeeders(dataSource);
  });

  afterEach(async () => {
    await dropDatabase({ options: ormTestOptions as DataSourceOptions });
    await createDatabase({ options: ormTestOptions as DataSourceOptions });
  });

  it('Make the 3 petitions succesfully', async () => {
    let token: string = '';
    let aceptancce: string = '';
    try {
      const tokenResponse: AxiosResponse = await firstValueFrom(
        httpService.post(
          process.env.WOMPI_URL + '/tokens/cards',
          {
            number: '4242424242424242',
            exp_month: '06',
            exp_year: '29',
            cvc: '123',
            card_holder: 'Pedro Pérez',
          },
          {
            headers: {
              Authorization: 'Bearer ' + process.env.WOMPI_PUB_KEY,
            },
          },
        ),
      );

      const {
        data: { id: tokenizedCard },
      } = tokenResponse.data;

      token = tokenizedCard;

      const accepResponse: AxiosResponse = await firstValueFrom(
        httpService.get(
          process.env.WOMPI_URL + '/merchants/' + process.env.WOMPI_PUB_KEY,
          {
            headers: {
              Authorization: 'Bearer ' + process.env.WOMPI_PUB_KEY,
            },
          },
        ),
      );

      const {
        data: {
          presigned_acceptance: { acceptance_token: accept },
        },
      } = accepResponse.data;

      aceptancce = accept;
    } catch (error) {
      expect(error).toBeNull();
    }

    let response = await request(app.getHttpServer())
      .post('/api/v1/trips/createPaymentService/1')
      .send({
        tokenized_payment: token,
        acceptance_token: aceptancce,
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toHaveProperty(
      'text',
      'Payment source successfully register',
    );

    response = await request(app.getHttpServer())
      .post('/api/v1/trips/1')
      .send({
        startLocation: {
          latitude: 0,
          longitude: 0,
        },
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toHaveProperty(
      'text',
      'Trip start successfully',
    );
    expect(response.body.message.driver).toHaveProperty('id');

    response = await request(app.getHttpServer())
      .delete('/api/v1/trips/1')
      .send({
        endLocation: {
          latitude: 0,
          longitude: 0,
        },
      });
    expect(response.status).toBe(202);
    expect(response.body.message).toHaveProperty(
      'text',
      'Trip finalized with successfully payment',
    );
    expect(response.body.message).toHaveProperty('finalPriceCent');
    expect(response.body.message).toHaveProperty('amount');
  });
});
