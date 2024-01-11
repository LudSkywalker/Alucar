import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

enum PaymentType {
  CARD = 'CARD',
  NEQUI = 'NEQUI',
}
export class CreatePaymentDto {
  @IsString()
  @MinLength(5)
  tokenized_payment: string;

  @IsString()
  @MinLength(5)
  acceptance_token: string;

  @IsEnum(PaymentType)
  @IsOptional()
  payment_type: PaymentType = PaymentType.CARD;
}
