import { Injectable } from '@nestjs/common';
import { createMollieClient, type MollieClient } from '@mollie/api-client';

@Injectable()
export class PaymentsService {
  private readonly mollie: MollieClient;

  constructor() {
    this.mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
  }

  async createPayment(params: {
    bookingId: string;
    workshopId: string;
    workshopTitle: string;
    amount: number;
    currency: string;
  }): Promise<{ id: string; checkoutUrl: string }> {
    const payment = await this.mollie.payments.create({
      amount: { value: params.amount.toFixed(2), currency: params.currency },
      description: `Workshop: ${params.workshopTitle}`,
      redirectUrl: `${process.env.FRONTEND_URL}/checkout/${params.bookingId}/success`,
      webhookUrl: `${process.env.WEBHOOK_BASE_URL}/payments/webhook`,
      metadata: { bookingId: params.bookingId, workshopId: params.workshopId },
    });

    return { id: payment.id, checkoutUrl: payment.getCheckoutUrl()! };
  }

  async getPayment(molliePaymentId: string) {
    return this.mollie.payments.get(molliePaymentId);
  }

  async createRefund(molliePaymentId: string, amount?: string) {
    const payment = await this.mollie.payments.get(molliePaymentId);
    return this.mollie.paymentRefunds.create({
      paymentId: molliePaymentId,
      amount: amount
        ? { value: amount, currency: payment.amount.currency }
        : payment.amount,
    });
  }
}
