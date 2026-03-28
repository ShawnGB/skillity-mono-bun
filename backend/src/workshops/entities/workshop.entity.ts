import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { User } from 'src/users/entities/user.entity';
import type { Booking } from 'src/bookings/entities/booking.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  WorkshopStatus,
  WorkshopCategory,
  WorkshopLevel,
  WorkshopSource,
} from 'src/types/enums';

@Entity()
export class Workshop extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'max_participants', type: 'int' })
  maxParticipants: number;

  @Column({ name: 'ticket_price', type: 'decimal', precision: 10, scale: 2 })
  ticketPrice: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  location: string;

  @Column({ name: 'location_lat', type: 'decimal', precision: 9, scale: 6, nullable: true })
  locationLat: number | null;

  @Column({ name: 'location_lng', type: 'decimal', precision: 9, scale: 6, nullable: true })
  locationLng: number | null;

  @Column({ name: 'starts_at', type: 'timestamp', nullable: true })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamp', nullable: true })
  endsAt: Date;

  @Column({ type: 'enum', enum: WorkshopCategory })
  category: WorkshopCategory;

  @Column({ type: 'enum', enum: WorkshopLevel, nullable: true })
  level: WorkshopLevel | null;

  @Column({
    type: 'enum',
    enum: WorkshopStatus,
    default: WorkshopStatus.DRAFT,
  })
  status: WorkshopStatus;

  @Column({ name: 'series_id', type: 'uuid', nullable: true })
  seriesId: string | null;

  @Column({ name: 'external_url', nullable: true })
  externalUrl: string | null;

  @Column({
    type: 'enum',
    enum: WorkshopSource,
    default: WorkshopSource.PLATFORM,
  })
  source: WorkshopSource;

  @Column({ name: 'host_id' })
  hostId: string;

  @ManyToOne('User', 'hosting')
  @JoinColumn({ name: 'host_id' })
  host: User;

  @OneToMany('Booking', 'workshop')
  bookings: Booking[];

  @OneToMany('Review', 'workshop')
  reviews: any[];

  @OneToMany('WorkshopConductor', 'workshop')
  conductors: any[];
}
