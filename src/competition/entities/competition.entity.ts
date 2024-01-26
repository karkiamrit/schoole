import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Event } from '@/event/entities/event.entity';
import { Participant } from '@/participant/entities/participant.entity';

@ObjectType()
@Entity('competitions')
export class Competition {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  category: string;

  @Field(() => [String])
  @Column('simple-array')
  rules: string[];

  @Field(() => Date)
  @Column()
  start_date: Date;

  @Field(() => Date)
  @Column()
  end_date: Date;

  @ManyToOne(() => Event, (event) => event.competitions)
  @Field(() => Event)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @ManyToMany(() => Participant, (participant) => participant.competitions, {
    eager: true,
  })
  @JoinTable()
  @Field(() => [Participant])
  participants: Participant[];

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
export class GetCompetitionType {
  @Field(() => [Competition], { nullable: true })
  data?: Competition[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
