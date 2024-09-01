import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from 'src/user/entities/user.entity';

export enum OtpType {
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  PHONE_VERIFY = 'PHONE_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@ObjectType()
@Entity('otps')
export class Otp extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  code: string;

  @Field(() => String)
  @Column()
  phone_number: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column({ type: 'enum', enum: OtpType })
  operation: OtpType;

  @Field()
  @Column()
  expires_in: Date;

  @Field()
  @Column({ default: false })
  is_used: boolean;
}
