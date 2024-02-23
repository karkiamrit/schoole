import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { MenuRepository } from './menu.repository';
import { Menu } from './entities/menu.entity';
import { CreateMenuInput, UpdateMenuInput } from './inputs/menu.input';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  getMany(qs?: RepoQuery<Menu>, query?: string) {
    return this.menuRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Menu>, query?: string) {
    if (query) {
      return this.menuRepository.getOne(qs, query);
    } else {
      return this.menuRepository.findOne(qs as FindOneOptions<Menu>);
    }
  }

  create(input: CreateMenuInput): Promise<Menu> {
    const menu = new Menu();
    Object.assign(menu, input);
    return this.menuRepository.save(menu);
  }

  createMany(input: CreateMenuInput[]): Promise<Menu[]> {
    return this.menuRepository.save(input);
  }

  async update(id: number, input: UpdateMenuInput): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    return this.menuRepository.save({ ...menu, ...input });
  }

  async delete(id: number) {
    const menu = this.menuRepository.findOne({ where: { id } });
    await this.menuRepository.delete({ id });
    return menu;
  }
}
