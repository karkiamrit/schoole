import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Institution } from '@/institution/entities/institution.entity';
import { Volunteer } from '@/volunteer/entities/volunteer.entity';

@ObjectType('kycs')
@Entity()
export class Kyc {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @OneToOne(() => Institution, { onDelete: 'CASCADE', eager: true })
  @Field(() => Institution, { nullable: true })
  @JoinColumn({ name: 'institution_id', referencedColumnName: 'id' })
  institution: Institution;

  @OneToOne(() => Volunteer, { onDelete: 'CASCADE', eager: true })
  @Field(() => Volunteer, { nullable: true })
  @JoinColumn({ name: 'volunteer_id', referencedColumnName: 'id' })
  volunteer: Volunteer;

  @Field(() => String)
  @Column()
  kyc_type: string;

  @Field(() => String)
  @Column()
  kyc_document: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;
}

@ObjectType()
export class GetKycType {
  @Field(() => [Kyc], { nullable: true })
  data?: Kyc[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
