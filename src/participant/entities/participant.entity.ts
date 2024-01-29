import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Competition } from '@/competition/entities/competition.entity';
import { Student } from '@/student/entities/student.entity';

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

  @ManyToMany(() => Competition, (competition) => competition.participants)
  @JoinTable()
  @Field(() => [Competition])
  competitions: Competition[];
}
