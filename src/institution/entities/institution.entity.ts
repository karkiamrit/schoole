import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity('institutions')
export class Institution {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  full_name: string;

  // eager true means that when we fetch an institution, we also fetch the user
  // ondelete cascade means that when we delete an institution, we also delete the user
  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @Field(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}

@ObjectType()
export class GetInstitutionType {
  @Field(() => [Institution], { nullable: true })
  data?: Institution[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
