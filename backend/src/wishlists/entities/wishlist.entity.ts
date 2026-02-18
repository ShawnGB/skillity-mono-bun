import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@Unique(['userId', 'workshopId'])
export class Wishlist extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'workshop_id' })
  workshopId: string;

  @ManyToOne('Workshop')
  @JoinColumn({ name: 'workshop_id' })
  workshop: any;
}
