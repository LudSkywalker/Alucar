import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreatePaymentDto } from './dto/cretate-payment.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('/createPaymentService/:id')
  createPayment(
    @Param('id') rider_id: number,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.tripsService.createPayment(rider_id, createPaymentDto);
  }

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(+id, updateTripDto);
  }
}
