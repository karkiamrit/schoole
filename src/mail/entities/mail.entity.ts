import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from '@/user/inputs/enums/role.enum';
import { MailType } from '@/mail/inputs/enums/mail.enum';

@ObjectType()
@Entity('mail_templates')
export class Mail extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: MailType, unique: true, nullable: false })
  mail_type: MailType;

  @Field()
  @Column()
  text_content: string;

  @Field()
  @Column({ nullable: true })
  html_content: string;

  @Field()
  @Column()
  subject: string;

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
export class GetMailType {
  @Field(() => [Mail], { nullable: true })
  data?: Mail[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
