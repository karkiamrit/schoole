import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

export enum OtpType {
  PHONE_VERIFY = 'PHONE_VERIFY',
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@ObjectType()
@Entity('otps')
export class Otp extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  code: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column({ type: 'enum', enum: OtpType })
  operation: OtpType;

  @Field()
  @Column({nullable:true})
  expires_in: Date;

  @Field()
  @Column({ default: false })
  is_used: boolean;
}
