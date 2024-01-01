import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Gender } from '../inputs/enums/student.enum';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity('students')
export class Student {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, { cascade: false })
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

  @Field(() => String)
  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Field(() => String)
  @Column({
    nullable: true,
  })
  date_of_birth: Date;

  @Field(() => Gender)
  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

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
}

@ObjectType()
export class GetStudentType {
  @Field(() => [Student], { nullable: true })
  data?: Student[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
