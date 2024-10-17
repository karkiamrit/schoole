import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from '@/student/entities/student.entity';
import { SubEvent } from '@/subevent/entities/subEvent.entity';

@ObjectType()
@Entity('participants')
export class Participant {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  sub_event_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String)
  transaction_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String)
  transaction_uuid: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'COMPLETE' })
  @Field(() => String)
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field(() => Number)
  total_amount: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Field(() => String)
  payment_method: string;

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
