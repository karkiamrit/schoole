import {
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Student } from '@/student/entities/student.entity';
import { SubEvent } from '@/subevent/entities/subEvent.entity';

@ObjectType()
@Entity('participants')
export class Participant {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Student, (student) => student.participations)
  @JoinColumn()
  @Field(() => Student)
  student: Student;

  @ManyToMany(() => SubEvent, (SubEvent) => SubEvent.participants)
  @Field(() => [SubEvent])
  SubEvents: SubEvent[];
}
