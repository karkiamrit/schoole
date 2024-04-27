import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from '@/student/entities/student.entity';
import { SubEvent } from '@/competition/entities/subEvent.entity';

@ObjectType()
@Entity('participants')
export class Participant {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Student, (student) => student.participations)
  @JoinColumn()
  @Field(() => Student)
  student: Student;

  @ManyToMany(() => SubEvent, (SubEvent) => SubEvent.participants)
  @JoinTable()
  @Field(() => [SubEvent])
  SubEvents: SubEvent[];
}
