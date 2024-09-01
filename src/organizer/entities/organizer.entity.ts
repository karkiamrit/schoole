import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { OrganizerType } from '../inputs/enums/organization_type.enums';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity('organizers')
export class Organizer {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  full_name: string;

  @Field(() => OrganizerType)
  @Column({ type: 'enum', enum: OrganizerType })
  organizer_type: OrganizerType;

  // eager true means that when we fetch an institution, we also fetch the user
  // ondelete cascade means that when we delete an user, we also delete the institution (composition)
  @OneToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @Field(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

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
export class GetOrganizerType {
  @Field(() => [Organizer], { nullable: true })
  data?: Organizer[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
