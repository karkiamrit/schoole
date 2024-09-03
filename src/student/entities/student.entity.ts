import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Gender, Level } from '../inputs/enums/index';
import { User } from 'src/user/entities/user.entity';
import { Certificate } from '@/certificate/entities/certificate.entity';
import { Participant } from '@/participant/entities/participant.entity';

@ObjectType()
@Entity('students')
export class Student {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Field(() => String)
  @Column()
  first_name: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  middle_name: string;

  @Field(() => String)
  @Column()
  last_name: string;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: false,
    type: 'date',
  })
  date_of_birth: Date;

  @Field(() => Gender)
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  // we can use simple array for storing interests
  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  interests?: string[];

  @Field(() => Level)
  @Column({ type: 'enum', enum: Level })
  level: Level;

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

  //reverse relation fields
  @OneToMany(() => Certificate, (certificate) => certificate.student)
  certificates: Certificate[];

  @OneToMany(() => Participant, (participant) => participant.student, {
    eager: true,
  })
  @Field(() => [Participant])
  participations: Participant[];
}

@ObjectType()
export class GetStudentType {
  @Field(() => [Student], { nullable: true })
  data?: Student[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
