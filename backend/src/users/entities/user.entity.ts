import { UserRole } from 'src/types/enums';
import { Column, Entity, OneToMany, ManyToMany } from 'typeorm';
import type { Workshop } from 'src/workshops/entities/workshop.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name', length: 150 })
  firstName: string;

  @Column({ name: 'last_name', length: 150 })
  lastName: string;

  @OneToMany('Workshop', 'host')
  hosting: Workshop[];

  @ManyToMany('Workshop', 'participants')
  workshops: Workshop[];
}
