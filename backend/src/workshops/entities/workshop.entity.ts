import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import type { User } from 'src/users/entities/user.entity';

@Entity()
export class Workshop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'max_participants', type: 'int' })
  maxParticipants: number;

  @Column({ name: 'ticket_price', type: 'decimal', precision: 10, scale: 2 })
  ticketPrice: number;

  @Column({ length: 3 }) // eg EUR, USD ...
  currency: string;

  @Column()
  location: string;

  @Column({ name: 'host_id' })
  hostId: string;

  @ManyToOne('User', 'hosting')
  @JoinColumn({ name: 'host_id' })
  host: User;

  @ManyToMany('User', 'workshops')
  @JoinTable({ name: 'workshop_participants' })
  participants: User[];
}
