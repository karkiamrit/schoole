import { GraphqlPassportAuthGuard } from '@/modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetMenuType, Menu } from './entities/menu.entity';
import { CreateMenuInput, UpdateMenuInput } from './inputs/menu.input';
@Resolver()
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Query(() => GetMenuType)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  getManyMenus(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Menu>,
    @CurrentQuery() query: string,
  ) {
    return this.menuService.getMany(qs, query);
  }

  @Query(() => Menu)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneMenu(
    @Args({ name: 'input' })
    qs: GetOneInput<Menu>,
    @CurrentQuery() query: string,
  ) {
    return this.menuService.getOne(qs, query);
  }

  @Mutation(() => Menu)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  createMenu(@Args('input') input: CreateMenuInput) {
    return this.menuService.create(input);
  }

  @Mutation(() => [Menu])
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  createManyMenu(
    @Args({ name: 'input', type: () => [CreateMenuInput] })
    input: CreateMenuInput[],
  ) {
    return this.menuService.createMany(input);
  }

  @Mutation(() => Menu)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateMenu(@Args('id') id: number, @Args('input') input: UpdateMenuInput) {
    return this.menuService.update(id, input);
  }

  @Mutation(() => Menu)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteMenu(@Args('id') id: number) {
    return this.menuService.delete(id);
  }
}
