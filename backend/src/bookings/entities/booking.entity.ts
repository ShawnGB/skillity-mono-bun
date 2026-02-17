import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BookingStatus } from 'src/types/enums';

@Entity()
export class Booking extends BaseEntity {
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'workshop_id' })
  workshopId: string;

  @Column({ name: 'payment_id', nullable: true })
  paymentId: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @ManyToOne('User', 'bookings')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Workshop', 'bookings')
  @JoinColumn({ name: 'workshop_id' })
  workshop: any;
}
