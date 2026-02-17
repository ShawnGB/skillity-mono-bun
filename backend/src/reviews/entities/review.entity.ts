import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@Unique(['userId', 'workshopId'])
export class Review extends BaseEntity {
  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'workshop_id' })
  workshopId: string;

  @ManyToOne('User', 'reviews')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Workshop', 'reviews')
  @JoinColumn({ name: 'workshop_id' })
  workshop: any;
}
