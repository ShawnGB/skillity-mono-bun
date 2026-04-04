import { UserRole } from 'src/types/enums';
import { Column, Entity, OneToMany } from 'typeorm';
import type { Workshop } from 'src/workshops/entities/workshop.entity';
import type { Booking } from 'src/bookings/entities/booking.entity';
import type { Review } from 'src/reviews/entities/review.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'first_name', length: 150, nullable: true })
  firstName: string | null;

  @Column({ name: 'last_name', length: 150, nullable: true })
  lastName: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ length: 120, nullable: true })
  tagline: string | null;

  @Column({ length: 120, nullable: true })
  profession: string | null;

  @Column({ length: 100, nullable: true })
  city: string | null;

  @Column({ name: 'conductor_type', length: 20, nullable: true })
  conductorType: 'individual' | 'company' | null;

  @Column({ name: 'company_name', length: 200, nullable: true })
  companyName: string | null;

  @Column({ name: 'vat_number', length: 50, nullable: true })
  vatNumber: string | null;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'avatar_key', nullable: true })
  avatarKey: string | null;

  @Column({ name: 'mollie_organization_id', nullable: true })
  mollieOrganizationId: string | null;

  @Column({ name: 'mollie_connected_at', type: 'timestamptz', nullable: true })
  mollieConnectedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany('Workshop', 'host')
  hosting: Workshop[];

  @OneToMany('Booking', 'user')
  bookings: Booking[];

  @OneToMany('Review', 'user')
  reviews: Review[];
}
