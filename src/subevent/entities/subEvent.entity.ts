import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event } from '@/event/entities/event.entity';
import { SubEventType } from '../inputs/enums';
import { Address } from '@/address/entities/address.entity';
import { User } from '@/user/entities/user.entity';
import { Student } from '@/student/entities/student.entity';

@ObjectType()
@Entity('sub_events')
export class SubEvent {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column('text')
  description: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  registration_fee: number;

  @Field(() => SubEventType)
  @Column({ enum: SubEventType, default: SubEventType.other })
  type: SubEventType;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  category?: string[];

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  rules: string;

  @Field(() => Date)
  @Column()
  start_date: Date;

  @Field(() => Date)
  @Column()
  end_date: Date;

  @ManyToOne(() => Event, (event) => event.SubEvents)
  @Field(() => Event)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => Address, { nullable: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: Address;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  banner: string;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.subEvents)
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  created_by: User;

  @Field(() => [Student], { nullable: true })
  @ManyToMany(() => Student, (student) => student.participatedSubEvents)
  participants: Student[];

  @Field(() => Int, { nullable: true })
  @Column({ default: 0, nullable: true })
  participant_count?: number;

  @Field(() => Boolean)
  @Column({ default: false })
  is_featured: boolean;
}

@ObjectType()
export class GetSubEventType {
  @Field(() => [SubEvent], { nullable: true })
  data?: SubEvent[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
