import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MenuFor } from '@/menu/enum/menu.enum';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
@Entity('menus')
export class Menu {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  menu_name: string;

  @Field(() => String)
  @Column({ unique: true })
  href: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  icon?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  parent_menu?: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: true })
  can_edit?: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  is_static_route?: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  is_hidden?: boolean;

  @Field(() => MenuFor)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: MenuFor })
  menu_for: MenuFor;
}

@ObjectType()
export class GetMenuType {
  @Field(() => [Menu], { nullable: true })
  data?: Menu[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
