import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Type } from '../inputs/enum/type.enum';
import { Event } from '@/event/entities/event.entity';

@ObjectType()
@Entity('institutions')
export class Institution {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Type)
  @Column('enum', { enum: Type })
  type: Type;

  // eager true means that when we fetch an institution, we also fetch the user
  // ondelete cascade means that when we delete an user, we also delete the institution (composition)
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToMany(() => Event, (event) => event.institutions)
  @Field(() => [Event])
  events: Event[];

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
export class GetInstitutionType {
  @Field(() => [Institution], { nullable: true })
  data?: Institution[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
