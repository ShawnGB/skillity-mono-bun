import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('workshop_conductor')
@Unique(['workshopId', 'userId'])
export class WorkshopConductor extends BaseEntity {
  @Column({ name: 'workshop_id' })
  workshopId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({
    name: 'payout_share',
    type: 'decimal',
    precision: 5,
    scale: 4,
    default: 1.0,
  })
  payoutShare: number;

  @ManyToOne('Workshop', 'conductors')
  @JoinColumn({ name: 'workshop_id' })
  workshop: any;

  @ManyToOne('User', 'conductorOf')
  @JoinColumn({ name: 'user_id' })
  user: any;
}
