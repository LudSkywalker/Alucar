import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

enum PaymentType {
  CARD = 'CARD',
  NEQUI = 'NEQUI',
}
export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  readonly tokenized_payment: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  readonly acceptance_token: string;

  @IsEnum(PaymentType)
  @IsOptional()
  readonly payment_type: PaymentType = PaymentType.CARD;
}
