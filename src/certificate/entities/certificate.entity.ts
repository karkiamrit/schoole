import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Student } from '@/student/entities/student.entity';

@ObjectType()
@Entity('certificates')
export class Certificate {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  certificate_title: string;

  @Field(() => String)
  @Column({ nullable: true })
  photo: string;

  @ManyToOne(() => Student, (student) => student.certificates, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => Student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
  student: Student;
}

@ObjectType()
export class GetCertificateType {
  @Field(() => [Certificate], { nullable: true })
  data?: Certificate[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
