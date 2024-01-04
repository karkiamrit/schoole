import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Certificate {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  title: string;

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
export class GetCertificateType {
  @Field(() => [Certificate], { nullable: true })
  data?: Certificate[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
