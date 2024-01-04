import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('kycs')
@Entity()
export class Kyc {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => Date)
  @Column({
    type: 'date',
  })
  established_on: Date;
}

@ObjectType()
export class GetKycType {
  @Field(() => [Kyc], { nullable: true })
  data?: Kyc[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
