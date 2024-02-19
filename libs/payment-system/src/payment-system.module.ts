import { Module } from '@nestjs/common';
import { PaymentSystemService } from './payment-system.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PaymentSystemService],
  exports: [PaymentSystemService],
})
export class PaymentSystemModule {}
