import { Controller, Post, Body, Param, Res, Delete } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreatePaymentDto } from './dto/cretate-payment.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('/createPaymentService/:riderID')
  createPayment(
    @Param('riderID') riderID: number,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.tripsService.createPayment(riderID, createPaymentDto);
  }

  @Post(':riderID')
  async create(
    @Param('riderID') riderID: number,
    @Body() createTripDto: CreateTripDto,
    @Res({ passthrough: true }) response,
  ) {
    const result = await this.tripsService.create(riderID, createTripDto);
    if (result.statusCode) {
      response.status(result.statusCode);
    }
    return result;
  }

  @Delete(':driverID')
  finish(
    @Param('driverID') driverID: number,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.finish(driverID, updateTripDto);
  }
}
