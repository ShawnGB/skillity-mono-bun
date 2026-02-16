import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { WorkshopStatus } from 'src/types/enums';

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

  @Column({ name: 'starts_at', type: 'timestamp', nullable: true })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamp', nullable: true })
  endsAt: Date;

  @Column({
    type: 'enum',
    enum: WorkshopStatus,
    default: WorkshopStatus.DRAFT,
  })
  status: WorkshopStatus;

  @Column({ name: 'host_id' })
  hostId: string;

  @ManyToOne('User', 'hosting')
  @JoinColumn({ name: 'host_id' })
  host: User;

  @ManyToMany('User', 'workshops')
  @JoinTable({ name: 'workshop_participants' })
  participants: User[];
}
