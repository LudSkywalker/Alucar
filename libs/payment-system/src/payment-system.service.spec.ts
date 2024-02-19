import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSystemService } from './payment-system.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('PaymentSystemService', () => {
  let service: PaymentSystemService;
  let mockHttpService;

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn().mockImplementation(() => of({})),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentSystemService, HttpService],
      imports: [HttpModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    service = module.get<PaymentSystemService>(PaymentSystemService);
  });

  it('Payment system should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPaymentSource should work', async () => {
    await service.addPaymentSource({
      type: '',
      token: '',
      acceptance_token: '',
      customer_email: '',
    });
    expect(mockHttpService.post).toHaveBeenCalled();
  });

  it('generateTransaction should work', async () => {
    await service.generateTransaction({
      amount_in_cents: 0,
      currency: '',
      customer_email: '',
      payment_method: { installments: 0 },
      payment_source_id: '',
      reference: '',
    });
    expect(mockHttpService.post).toHaveBeenCalled();
  });
});
