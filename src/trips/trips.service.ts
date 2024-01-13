import { BadRequestException, Injectable } from '@nestjs/common';
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
import { Trip, TripStates } from './entities/trip.entity';

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

  async createPayment(riderID: number, createPaymentDto: CreatePaymentDto) {
    const rider = await this.riderRepository.findOneBy({ id: riderID });

    if (!rider) {
      throw new BadRequestException('Rider not exist');
    }
    const paymentSourceData = {
      type: createPaymentDto.payment_type,
      token: createPaymentDto.tokenized_payment,
      acceptance_token: createPaymentDto.acceptance_token,
      customer_email: rider.email,
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
        message: { text: 'Payment source successfully register' },
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

  async create(riderID: number, createTripDto: CreateTripDto) {
    const rider = await this.riderRepository.findOneBy({ id: riderID });

    if (!rider) {
      throw new BadRequestException('Rider not exist');
    }

    if (!rider.paymentSourceID) {
      throw new BadRequestException('Rider not have payment source');
    }

    const pendingTrip = await this.tripRepository.findOneBy({
      rider,
      state: TripStates.PENDING,
    });

    if (pendingTrip) {
      throw new BadRequestException('Rider is already on a trip');
    }

    const driver = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.trips', 'trip', 'trip.state = :state', {
        state: TripStates.PENDING,
      })
      .groupBy('driver.id')
      .addGroupBy('trip.id')
      .having('COUNT(trip.id) = 0')
      .getOne();

    if (!driver) {
      return {
        message: {
          text: 'No avaliable drivers at this moment',
        },
        statusCode: 202,
      };
    }

    const trip = await this.tripRepository.create({
      startTime: createTripDto.startTime,
      rider,
      driver,
    });

    trip.startLocation = [
      createTripDto.startLocation.latitude,
      createTripDto.startLocation.longitude,
    ];
    await this.tripRepository.save(trip);
    return {
      message: {
        text: 'Trip start successfully register',
        driver: { id: trip.driver.id, name: trip.driver.name },
      },
      statusCode: 201,
    };
  }

  async finish(driverID: number, updateTripDto: UpdateTripDto) {
    const driver = await this.riderRepository.findOneBy({ id: driverID });
    if (!driver) {
      throw new BadRequestException('Driver not exist');
    }

    const pendingTrip = await this.tripRepository.findOne({
      relations: { driver: true },
      where: {
        state: TripStates.PENDING,
        driver: { id: driver.id },
      },
    });

    if (!pendingTrip) {
      throw new BadRequestException('Driver no has pending trip');
    }
    const rider = pendingTrip.rider;

    pendingTrip.endLocation = [
      updateTripDto.endLocation.latitude,
      updateTripDto.endLocation.longitude,
    ];
    pendingTrip.endTime = new Date(updateTripDto.endTime);
    pendingTrip.state = TripStates.COMPLETED;

    await this.tripRepository.save(pendingTrip);

    const totalAmount = {
      base: { unit: '', price: 3500, quantity: 1 },
      distance: { unit: 'km', price: 1000, quantity: 0 },
      time: { unit: 'min', price: 200, quantity: 0 },
    };

    //Calculated with values based on the ecuador for longitude
    const latKm =
      (pendingTrip.endLocation[0] - pendingTrip.startLocation[0]) * 111.12;
    const lonKm =
      (pendingTrip.endLocation[1] - pendingTrip.startLocation[1]) * 111.32;
    totalAmount.distance.quantity = Math.hypot(latKm, lonKm);

    const timeDiff =
      (pendingTrip.endTime.getTime() - pendingTrip.startTime.getTime()) /
      (1000 * 60);
    totalAmount.time.quantity = timeDiff;
    const finalPriceCent = Math.trunc(
      Object.values(totalAmount).reduce(
        (accPrice, fee) => accPrice + fee.quantity * fee.price,
        0,
      ) * 100,
    );

    const transactionData = {
      amount_in_cents: finalPriceCent,
      signature: '',
      currency: 'COP',
      customer_email: rider.email,
      payment_method: {
        installments: 1,
      },
      reference:
        'TRIP-' + pendingTrip.id + '-' + pendingTrip.startTime.getTime(),
      payment_source_id: rider.paymentSourceID,
    };
    const signatureClean =
      transactionData.reference +
      transactionData.amount_in_cents +
      transactionData.currency +
      process.env.WOMPI_INTE_KEY;
    const encondedText = new TextEncoder().encode(signatureClean);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    transactionData.signature = hashHex;

    try {
      await firstValueFrom(
        this.httpService.post(
          process.env.WOMPI_URL + '/transactions',
          transactionData,
          {
            headers: {
              Authorization: 'Bearer ' + process.env.WOMPI_PRV_KEY,
            },
          },
        ),
      );
      return {
        message: {
          text: 'Trip finalized with successfully payment',
          amount: totalAmount,
          finalPriceCent,
        },
        statusCode: 202,
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
}
