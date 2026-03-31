import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';

describe('PaymentsController.handleWebhook', () => {
  let controller: PaymentsController;
  let bookingsService: { handlePaymentConfirmed: jest.Mock; handleChargeback: jest.Mock };
  let paymentsService: { getPayment: jest.Mock };

  beforeEach(async () => {
    bookingsService = {
      handlePaymentConfirmed: jest.fn().mockResolvedValue(undefined),
      handleChargeback: jest.fn().mockResolvedValue(undefined),
    };
    paymentsService = {
      getPayment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        { provide: PaymentsService, useValue: paymentsService },
        { provide: BookingsService, useValue: bookingsService },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('calls handlePaymentConfirmed when payment status is paid', async () => {
    paymentsService.getPayment.mockResolvedValue({ status: 'paid' });
    await controller.handleWebhook({ id: 'tr_abc' });
    expect(bookingsService.handlePaymentConfirmed).toHaveBeenCalledWith('tr_abc');
    expect(bookingsService.handleChargeback).not.toHaveBeenCalled();
  });

  it('calls handleChargeback when payment status is charged_back', async () => {
    paymentsService.getPayment.mockResolvedValue({ status: 'charged_back' });
    await controller.handleWebhook({ id: 'tr_abc' });
    expect(bookingsService.handleChargeback).toHaveBeenCalledWith('tr_abc');
    expect(bookingsService.handlePaymentConfirmed).not.toHaveBeenCalled();
  });

  it('does nothing for failed/expired/cancelled payments', async () => {
    for (const status of ['failed', 'expired', 'canceled']) {
      paymentsService.getPayment.mockResolvedValue({ status });
      await controller.handleWebhook({ id: 'tr_abc' });
      expect(bookingsService.handlePaymentConfirmed).not.toHaveBeenCalled();
      expect(bookingsService.handleChargeback).not.toHaveBeenCalled();
      jest.clearAllMocks();
    }
  });

  it('returns { received: true } even if an error is thrown', async () => {
    paymentsService.getPayment.mockRejectedValue(new Error('Mollie down'));
    const result = await controller.handleWebhook({ id: 'tr_abc' });
    expect(result).toEqual({ received: true });
  });
});
