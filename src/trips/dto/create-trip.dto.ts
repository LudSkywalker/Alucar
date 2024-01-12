import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class LocationDto {
  @IsNumber()
  @IsNotEmpty()
  readonly latitude: number;

  @IsNumber()
  @IsNotEmpty()
  readonly longitude: number;
}
export class CreateTripDto {
  @Type(() => LocationDto)
  @IsNotEmpty()
  @ValidateNested()
  readonly startLocation: LocationDto;

  @IsDate()
  @IsNotEmpty()
  startTime: Date = new Date();
}
