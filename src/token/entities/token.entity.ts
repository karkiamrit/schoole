import { User } from '@/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@ObjectType()
@Entity('tokens')
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column()
  expires_in: Date;

  @Field()
  @Column({ default: false })
  is_revoked: boolean;
}
