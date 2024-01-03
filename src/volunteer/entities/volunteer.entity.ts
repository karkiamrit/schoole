import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType('volunteers')
@Entity()
export class Volunteer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  full_name: string;

  // eager true means that when we fetch an institution, we also fetch the user
  // ondelete cascade means that when we delete an institution, we also delete the user (composition)
  @OneToOne(() => User, { eager: true })
  @Field(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Field(() => Date)
  @Column({
    type: 'date',
  })
  starting_date: Date;

  @Field(() => Date)
  @Column({
    type: 'date',
  })
  event_date: Date;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;
}

@ObjectType()
export class GetVolunteerType {
  @Field(() => [Volunteer], { nullable: true })
  data?: Volunteer[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
