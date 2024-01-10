import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @MinLength(5)
  tokenized_card: string;

  @IsString()
  @MinLength(5)
  acceptance_token: string;

  @IsString()
  @IsOptional()
  payment_type?: string = 'CARD';
}
