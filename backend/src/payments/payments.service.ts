import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Client } from 'mollie-api-typescript';
import type { EntityBalanceTransfer } from 'mollie-api-typescript/models';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly client: Client;

  constructor() {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) throw new Error('MOLLIE_API_KEY is not set');
    this.client = new Client({ security: { apiKey } });
  }

  async createPayment(params: {
    bookingId: string;
    workshopId: string;
    workshopTitle: string;
    amount: number;
    currency: string;
  }): Promise<{ id: string; checkoutUrl: string }> {
    const webhookUrl = await this.resolveWebhookUrl();

    const payment = await this.client.payments.create({
      idempotencyKey: params.bookingId,
      paymentRequest: {
        amount: { value: params.amount.toFixed(2), currency: params.currency },
        description: `Workshop: ${params.workshopTitle}`,
        redirectUrl: `${process.env.FRONTEND_URL}/checkout/${params.bookingId}/success`,
        webhookUrl,
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
    return this.client.payments.get({ paymentId: molliePaymentId });
  }

  async createRefund(molliePaymentId: string, amount?: string) {
    const payment = await this.client.payments.get({ paymentId: molliePaymentId });
    return this.client.refunds.create({
      paymentId: molliePaymentId,
      refundRequest: {
        description: 'Workshop refund',
        amount: amount
          ? { value: amount, currency: payment.amount!.currency }
          : payment.amount!,
        metadata: null,
      },
    });
  }

  async createTransfer(params: {
    destination: string;
    amount: number;
    currency: string;
    idempotencyKey: string;
  }): Promise<{ id: string }> {
    const platformOrgId = process.env.MOLLIE_PLATFORM_ORG_ID;
    if (!platformOrgId) throw new Error('MOLLIE_PLATFORM_ORG_ID is not set');

    const entityBalanceTransfer: EntityBalanceTransfer = {
      amount: { value: params.amount.toFixed(2), currency: params.currency },
      source: { type: 'organization', id: platformOrgId, description: 'Skillity platform' },
      destination: { type: 'organization', id: params.destination, description: 'Conductor payout' },
      description: 'Workshop conductor payout',
    };

    const transfer = await this.client.balanceTransfers.create({
      idempotencyKey: params.idempotencyKey,
      entityBalanceTransfer,
    });
    return { id: transfer.id };
  }

  private async resolveWebhookUrl(): Promise<string> {
    const override = process.env.WEBHOOK_BASE_URL;
    if (override) return `${override}/payments/webhook`;

    try {
      const res = await fetch('http://ngrok:4040/api/tunnels');
      const data = await res.json() as { tunnels: { proto: string; public_url: string }[] };
      const tunnel = data.tunnels.find((t) => t.proto === 'https');
      if (tunnel) {
        this.logger.log(`Using ngrok tunnel: ${tunnel.public_url}`);
        return `${tunnel.public_url}/payments/webhook`;
      }
    } catch {
      this.logger.warn('Could not reach ngrok API — webhook will be omitted');
    }

    throw new InternalServerErrorException(
      'No webhook URL available. Set WEBHOOK_BASE_URL or start ngrok.',
    );
  }
}
