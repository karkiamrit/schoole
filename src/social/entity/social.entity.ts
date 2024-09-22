import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SocialType } from '@/social/inputs/enums/social_type.enum';
import { User } from '@/user/entities/user.entity';

@ObjectType()
@Entity('socials')
@Unique(['user', 'social_type'])
export class Social {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => SocialType)
  @Column({ type: 'enum', enum: SocialType })
  social_type: SocialType;

  @Field(() => String)
  @Column()
  social_link: string;

  @ManyToOne(() => User, (user) => user.socials, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @Field(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
