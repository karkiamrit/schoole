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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Field(() => String, { nullable: true })
  @Column()
  latitude: string;

  @Field(() => String, { nullable: true })
  @Column()
  longitude: string;

  @Field(() => String, { nullable: true })
  @Column()
  address_type: string;

  @Field(() => String, { nullable: false })
  @Column()
  display_name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  state: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  municipality: string;

  @Field(() => String, { nullable: true })
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
