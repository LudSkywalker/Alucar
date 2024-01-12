import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { LocationDto } from './create-trip.dto';
import { Type } from 'class-transformer';

export class UpdateTripDto {
  @Type(() => LocationDto)
  @IsNotEmpty()
  @ValidateNested()
  readonly endLocation: LocationDto;

  @IsDate()
  @IsNotEmpty()
  endTime: Date = new Date();
}
