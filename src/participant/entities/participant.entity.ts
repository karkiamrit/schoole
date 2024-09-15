import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { Student } from '@/student/entities/student.entity';
import { SubEvent } from '@/subevent/entities/subEvent.entity';

@ObjectType()
@Entity('participants')
export class Participant {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  sub_event_id: number;

  @ManyToOne(() => Student, (student) => student.participatedSubEvents, {
    nullable: false,
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => SubEvent, (subEvent) => subEvent.participants, {
    nullable: false,
  })
  @JoinColumn({ name: 'sub_event_id' })
  subEvent: SubEvent;
}
