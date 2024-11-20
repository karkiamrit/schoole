import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Address } from '@/address/entities/address.entity';
import { Institution } from '@/institution/entities/institution.entity';
import { SubEvent } from '@/subevent/entities/subEvent.entity';
import { User } from '@/user/entities/user.entity';

@ObjectType()
@Entity('events')
export class Event {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  entry_fee: number;

  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => Address, { nullable: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: Address;

  @OneToMany(() => SubEvent, (SubEvent) => SubEvent.event)
  @Field(() => [SubEvent])
  SubEvents: SubEvent[];

  @ManyToOne(() => Institution, (institution) => institution.events, {
    eager: true,
    nullable: true, //temp nullable
  })
  @Field(() => Institution)
  @JoinColumn({ name: 'institution_id', referencedColumnName: 'id' })
  institution: Institution;

  @Field(() => String)
  @Column('date')
  start_date: Date;

  @Field(() => String)
  @Column('date')
  end_date: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  banner: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, name: 'display_picture' })
  displayPicture: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @Field(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;
}

@ObjectType()
export class GetEventType {
  @Field(() => [Event], { nullable: true })
  data?: Event[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
