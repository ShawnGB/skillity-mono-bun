import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { InternalServerErrorException } from '@nestjs/common';

const mockClient = {
  payments: {
    create: jest.fn(),
    get: jest.fn(),
  },
  refunds: {
    create: jest.fn(),
  },
  balanceTransfers: {
    create: jest.fn(),
  },
};

jest.mock('mollie-api-typescript', () => ({
  Client: jest.fn().mockImplementation(() => mockClient),
}));

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    process.env.MOLLIE_API_KEY = 'test_key';
    process.env.FRONTEND_URL = 'http://localhost:3001';
    process.env.WEBHOOK_BASE_URL = 'https://example.ngrok.io';
    process.env.MOLLIE_PLATFORM_ORG_ID = 'test_platform_org';
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('createPayment', () => {
    it('returns id and checkoutUrl from Mollie', async () => {
      mockClient.payments.create.mockResolvedValue({
        id: 'tr_test123',
        links: { checkout: { href: 'https://checkout.mollie.com/tr_test123' } },
      });

      const result = await service.createPayment({
        bookingId: 'booking-1',
        workshopId: 'ws-1',
        workshopTitle: 'Pottery 101',
        amount: 50,
        currency: 'EUR',
      });

      expect(result).toEqual({
        id: 'tr_test123',
        checkoutUrl: 'https://checkout.mollie.com/tr_test123',
      });
      expect(mockClient.payments.create).toHaveBeenCalledWith(
        expect.objectContaining({
          idempotencyKey: 'booking-1',
          paymentRequest: expect.objectContaining({
            amount: { value: '50.00', currency: 'EUR' },
            description: 'Workshop: Pottery 101',
          }),
        }),
      );
    });

    it('throws InternalServerErrorException when Mollie returns no checkout URL', async () => {
      mockClient.payments.create.mockResolvedValue({ id: 'tr_test', links: {} });

      await expect(
        service.createPayment({
          bookingId: 'booking-1',
          workshopId: 'ws-1',
          workshopTitle: 'Test',
          amount: 10,
          currency: 'EUR',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createRefund', () => {
    it('calls Mollie refunds.create with the payment amount', async () => {
      mockClient.payments.get.mockResolvedValue({
        amount: { value: '50.00', currency: 'EUR' },
      });
      mockClient.refunds.create.mockResolvedValue({ id: 're_test' });

      await service.createRefund('tr_test123');

      expect(mockClient.refunds.create).toHaveBeenCalledWith({
        paymentId: 'tr_test123',
        refundRequest: {
          description: 'Workshop refund',
          amount: { value: '50.00', currency: 'EUR' },
          metadata: null,
        },
      });
    });
  });

  describe('createTransfer', () => {
    it('calls Mollie balanceTransfers.create with source, destination, and amount', async () => {
      mockClient.balanceTransfers.create.mockResolvedValue({ id: 'tr_transfer_1' });

      const result = await service.createTransfer({
        destination: 'org_abc123',
        amount: 95,
        currency: 'EUR',
        idempotencyKey: 'hp-payout-1',
      });

      expect(result).toEqual({ id: 'tr_transfer_1' });
      expect(mockClient.balanceTransfers.create).toHaveBeenCalledWith({
        idempotencyKey: 'hp-payout-1',
        entityBalanceTransfer: {
          amount: { value: '95.00', currency: 'EUR' },
          source: { type: 'organization', id: 'test_platform_org', description: 'Skillity platform' },
          destination: { type: 'organization', id: 'org_abc123', description: 'Conductor payout' },
          description: 'Workshop conductor payout',
        },
      });
    });
  });
});
