import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Address {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  state: string;

  @Field(() => String)
  @Column()
  district: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => Number)
  @Column()
  ward: number;
}

@ObjectType()
export class GetAddressType {
  @Field(() => [Address], { nullable: true })
  data?: Address[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
