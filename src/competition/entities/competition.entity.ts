import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('competitions')
export class Competition {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;
}

@ObjectType()
export class GetCompetitionType {
  @Field(() => [Competition], { nullable: true })
  data?: Competition[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
