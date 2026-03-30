import { Controller, Post, Body, HttpCode, Logger } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: { id: string }) {
    try {
      const payment = await this.paymentsService.getPayment(body.id);

      if (payment.status === 'paid') {
        await this.bookingsService.handlePaymentConfirmed(body.id);
      }
    } catch (err) {
      this.logger.error(`Webhook error for payment ${body.id}: ${err}`);
    }

    return { received: true };
  }
}
