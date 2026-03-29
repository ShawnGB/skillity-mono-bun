import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import type { Workshop } from './workshop.entity';
import type { User } from 'src/users/entities/user.entity';
import { PhotoStatus } from 'src/types/enums';

@Entity()
export class WorkshopPhoto extends BaseEntity {
  @Column({ name: 'workshop_id' })
  workshopId: string;

  @ManyToOne('Workshop', 'photos', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  @Column({ name: 'uploader_id' })
  uploaderId: string;

  @ManyToOne('User')
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;

  @Column()
  url: string;

  @Column({ name: 'storage_key' })
  storageKey: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: PhotoStatus;

  @Column({ type: 'text', nullable: true })
  caption: string | null;
}
