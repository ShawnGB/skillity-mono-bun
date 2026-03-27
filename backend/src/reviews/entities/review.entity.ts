import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@Index(['userId', 'seriesId'], {
  unique: true,
  where: '"series_id" IS NOT NULL',
})
@Index(['userId', 'workshopId'], {
  unique: true,
  where: '"series_id" IS NULL',
})
export class Review extends BaseEntity {
  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'workshop_id' })
  workshopId: string;

  @Column({ name: 'series_id', type: 'uuid', nullable: true })
  seriesId: string | null;

  @ManyToOne('User', 'reviews')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Workshop', 'reviews')
  @JoinColumn({ name: 'workshop_id' })
  workshop: any;
}
