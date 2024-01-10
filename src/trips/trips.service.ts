import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreatePaymentDto } from './dto/cretate-payment.dto';

@Injectable()
export class TripsService {
  createPayment(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new trip';
  }

  create(createTripDto: CreateTripDto) {
    return 'This action adds a new trip';
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }
}
