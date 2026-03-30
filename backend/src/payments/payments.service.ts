import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client } from 'mollie-api-typescript';

@Injectable()
export class PaymentsService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      security: { apiKey: process.env.MOLLIE_API_KEY! },
    });
  }

  async createPayment(params: {
    bookingId: string;
    workshopId: string;
    workshopTitle: string;
    amount: number;
    currency: string;
  }): Promise<{ id: string; checkoutUrl: string }> {
    const payment = await this.client.payments.create({
      idempotencyKey: params.bookingId,
      paymentRequest: {
        amount: { value: params.amount.toFixed(2), currency: params.currency },
        description: `Workshop: ${params.workshopTitle}`,
        redirectUrl: `${process.env.FRONTEND_URL}/checkout/${params.bookingId}/success`,
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/payments/webhook`,
        metadata: { bookingId: params.bookingId, workshopId: params.workshopId },
      },
    });

    const checkoutUrl = payment.links?.checkout?.href;
    if (!checkoutUrl) {
      throw new InternalServerErrorException('Mollie did not return a checkout URL');
    }

    return { id: payment.id, checkoutUrl };
  }

  async getPayment(molliePaymentId: string) {
    return this.client.payments.get({ id: molliePaymentId });
  }

  async createRefund(molliePaymentId: string, amount?: string) {
    const payment = await this.client.payments.get({ id: molliePaymentId });
    return this.client.refunds.create({
      paymentId: molliePaymentId,
      refundRequest: {
        amount: amount
          ? { value: amount, currency: payment.amount!.currency }
          : payment.amount,
      },
    });
  }
}
