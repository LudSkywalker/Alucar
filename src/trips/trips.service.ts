import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreatePaymentDto } from './dto/cretate-payment.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from './entities/rider.entity';
import { Driver } from './entities/driver.entity';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly httpService: HttpService,
  ) {}

  async createPayment(rider_id: number, createPaymentDto: CreatePaymentDto) {
    console.log(await this.riderRepository.find());

    const rider = await this.riderRepository.findOneBy({ id: rider_id });

    if (!rider) {
      throw new BadRequestException('Rider not exist');
    }
    const paymentSourceData = {
      type: createPaymentDto.payment_type,
      token: createPaymentDto.tokenized_payment,
      acceptance_token: createPaymentDto.acceptance_token,
      customer_email: process.env.WOMPI_CUSTOMER_EMAIL,
    };

    try {
      const paymentResponse: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          process.env.WOMPI_URL + '/payment_sources',
          paymentSourceData,
          {
            headers: {
              Authorization: 'Bearer ' + process.env.WOMPI_PRV_KEY,
            },
          },
        ),
      );
      const {
        data: { id: paymentSourceID },
      } = paymentResponse.data;
      rider.paymentSourceID = paymentSourceID;
      await this.riderRepository.save(rider);
      return {
        message: 'Payment source successfully register',
        statusCode: 201,
      };
    } catch (error) {
      const { error: requestError } = error.response.data;
      const responseError = {
        message: null,
        statusCode: 400,
        error: 'Bad Request',
      };
      console.log(requestError);
      if (requestError.type == 'INPUT_VALIDATION_ERROR') {
        responseError.message = requestError.messages;
      }
      throw new BadRequestException(responseError);
    }
  }

  create(createTripDto: CreateTripDto) {
    return 'This action adds a new trip';
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }
}
