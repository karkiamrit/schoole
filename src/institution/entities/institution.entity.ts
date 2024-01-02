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

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @Field(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@ObjectType()
export class GetInstitutionType {
  @Field(() => [Institution], { nullable: true })
  data?: Institution[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
