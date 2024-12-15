import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ContactType } from '@/contact/inputs/contact.enum';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('contacts')
export class Contact {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Field(() => String)
  @Column({ name: 'mobile_number', length: 15 })
  mobileNumber: string;

  @Field(() => String)
  @Column({ name: 'organization_name', length: 255 })
  organizationName: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'phone', length: 15, nullable: true })
  phone?: string | null;

  @Field(() => String)
  @Column({ name: 'email', length: 255, unique: false })
  email: string;

  @Field(() => String)
  @Column('text')
  message: string;

  @Field(() => [String])
  @Column('simple-array')
  source: string[];

  @Field(() => String)
  @Column({ name: 'other_source', unique: false })
  otherSource: string;

  @Column({
    type: 'enum',
    name: 'contact_type',
    enum: ContactType,
  })
  contactType: ContactType;
}
