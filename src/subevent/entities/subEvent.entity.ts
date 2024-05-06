import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Event } from '@/event/entities/event.entity';
import { Participant } from '@/participant/entities/participant.entity';
import { SubEventType } from '../inputs/enums';
import { Address } from '@/address/entities/address.entity';

@ObjectType()
@Entity('SubEvents')
export class SubEvent {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => SubEventType)
  @Column({ enum: SubEventType, default: SubEventType.other })
  type: SubEventType;

  @Field(() => String)
  @Column()
  category: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  rules: string[];

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

  @ManyToMany(() => Participant, (participant) => participant.SubEvents, {
    eager: true,
  })
  @JoinTable()
  @Field(() => [Participant])
  participants: Participant[];

  @OneToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'address_id' })
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
}

@ObjectType()
export class GetSubEventType {
  @Field(() => [SubEvent], { nullable: true })
  data?: SubEvent[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
