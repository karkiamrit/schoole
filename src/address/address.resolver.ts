import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetAddressType, Address } from './entities/address.entity';
import { CreateAddressInput, UpdateAddressInput } from './inputs/address.input';
@Resolver()
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query(() => GetAddressType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyAddresss(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Address>,
    @CurrentQuery() query: string,
  ) {
    return this.addressService.getMany(qs, query);
  }

  @Query(() => Address)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneAddress(
    @Args({ name: 'input' })
    qs: GetOneInput<Address>,
    @CurrentQuery() query: string,
  ) {
    return this.addressService.getOne(qs, query);
  }

  @Mutation(() => Address)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createAddress(@Args('input') input: CreateAddressInput) {
    return this.addressService.create(input);
  }


  @Mutation(() => Address)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateAddress(
    @Args('id') id: number,
    @Args('input') input: UpdateAddressInput,
  ) {
    return this.addressService.update(id, input);
  }

  @Mutation(() => Address)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteAddress(@Args('id') id: number) {
    return this.addressService.delete(id);
  }
}
