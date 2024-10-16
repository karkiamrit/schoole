import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('payments')
export class Payment {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  payment_method: string;
}

@ObjectType()
export class GetPaymentType {
  @Field(() => [Payment], { nullable: true })
  data?: Payment[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
