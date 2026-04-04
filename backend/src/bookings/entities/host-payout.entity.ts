import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PayoutStatus } from 'src/types/enums';

@Entity('host_payout')
@Index(['bookingId'])
@Index(['hostUserId'])
export class HostPayout extends BaseEntity {
  @Column({ name: 'booking_id' })
  bookingId: string;

  @Column({ name: 'host_user_id' })
  hostUserId: string;

  @Column({ name: 'workshop_id' })
  workshopId: string;

  @Column({ name: 'gross_amount', type: 'decimal', precision: 10, scale: 2 })
  grossAmount: number;

  @Column({ name: 'payout_share', type: 'decimal', precision: 5, scale: 4 })
  payoutShare: number;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus;

  @Column({ name: 'ready_at', type: 'timestamptz', nullable: true })
  readyAt: Date | null;

  @Column({ name: 'mollie_transfer_id', nullable: true })
  mollieTransferId: string | null;

  @ManyToOne('Booking')
  @JoinColumn({ name: 'booking_id' })
  booking: any;

  @ManyToOne('User')
  @JoinColumn({ name: 'host_user_id' })
  hostUser: any;

  @ManyToOne('Workshop')
  @JoinColumn({ name: 'workshop_id' })
  workshop: any;
}
