import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaymentSourceData, TransactionData } from './payment-system.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class PaymentSystemService {
  constructor(private readonly httpService: HttpService) {}

  async addPaymentSource(
    paymentSourceData: PaymentSourceData,
  ): Promise<AxiosResponse> {
    const response = await firstValueFrom(
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
    return response;
  }
  async generateTransaction(
    transactionData: TransactionData,
  ): Promise<AxiosResponse> {
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

    const response = await firstValueFrom(
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
    return response;
  }
}
