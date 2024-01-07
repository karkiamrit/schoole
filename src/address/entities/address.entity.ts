import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/entities/user.entity';

@ObjectType()
@Entity('addresses')
export class Address {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => User)
  @Field(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Field(() => String)
  @Column()
  latitude: string;

  @Field(() => String)
  @Column()
  longitude: string;

  @Field(() => String)
  @Column()
  address_type: string;

  @Field(() => String)
  @Column()
  display_name: string;

  @Field(() => String)
  @Column({ nullable: true })
  country: string;

  @Field(() => String)
  @Column({ nullable: true })
  state: string;

  @Field(() => String)
  @Column({ nullable: true })
  district: string;

  @Field(() => String)
  @Column({ nullable: true })
  municipality: string;

  @Field(() => String)
  @Column({ nullable: true })
  town: string;

  @Field(() => String)
  @Column({ nullable: true })
  postal_code: string;
}

@ObjectType()
export class GetAddressType {
  @Field(() => [Address], { nullable: true })
  data?: Address[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
