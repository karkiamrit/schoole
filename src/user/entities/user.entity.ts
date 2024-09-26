import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from '../inputs/enums/role.enum';
import { Address } from '@/address/entities/address.entity';
import { UserType } from '@/user/inputs/enums/usertype.enum';
import { Student } from '@/student/entities/student.entity';
import { Institution } from '@/institution/entities/institution.entity';
import { SubEvent } from '@/subevent/entities/subEvent.entity';
import { Social } from '@/social/entity/social.entity';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment') // change to bigInt in Production
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, unique: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  profile_picture?: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  last_login?: Date;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column({ unique: true, nullable: true })
  username?: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @Field(() => UserType)
  @Column({ type: 'enum', enum: UserType, default: UserType.student })
  user_type: UserType;

  @Field(() => String)
  @Column({ nullable: true })
  refresh_token?: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @OneToOne(() => Student, (student) => student.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => Student, { nullable: true })
  student: Student;

  @OneToOne(() => Institution, (institution) => institution.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => Institution, { nullable: true })
  institution: Institution;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;

  @Field()
  @Column({ default: false })
  email_verified: boolean;

  @Field()
  @Column({ default: false })
  phone_verified: boolean;

  @OneToOne(() => Address, (address) => address.user, { eager: true })
  @Field(() => Address, { nullable: true })
  address: Address;

  @OneToMany(() => Social, (social) => social.user, { eager: true })
  @Field(() => [Social], { nullable: true })
  socials: Social[];

  @OneToMany(() => SubEvent, (SubEvent) => SubEvent.created_by)
  @Field(() => [SubEvent])
  subEvents: SubEvent[];

  @BeforeInsert()
  async beforeInsert() {
    if (!this.role) {
      this.role = Role.user;
    }
  }
}

@ObjectType()
export class GetUserType {
  @Field(() => [User], { nullable: true })
  data?: User[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
