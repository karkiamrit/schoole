import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { MenuFor } from '@/menu/enum/menu.enum';

@InputType()
export class CreateMenuInput {
  @Field(() => String)
  @IsNotEmpty()
  menu_name: string;

  @Field(() => String)
  @IsNotEmpty()
  href: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  icon?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  parent_menu?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  can_edit?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  is_static_route?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  is_hidden?: boolean;

  @Field(() => MenuFor)
  @IsNotEmpty()
  menu_for: MenuFor;
}

@InputType()
export class UpdateMenuInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  menu_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  href?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  icon?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  parent_menu?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  can_edit?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  is_static_route?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  is_hidden?: boolean;

  @Field(() => MenuFor, { nullable: false })
  @IsOptional()
  menu_for?: MenuFor;
}
