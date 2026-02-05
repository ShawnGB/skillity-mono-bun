import { UserRole } from 'src/types/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import type { Workshop } from 'src/workshops/entities/workshop.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  // relations

  @OneToMany('Workshop', 'host')
  hosting: Workshop[];

  @ManyToMany('Workshop', 'participants')
  workshops: Workshop[];
}
