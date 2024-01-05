import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CertificateService } from './certificate.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetCertificateType, Certificate } from './entities/certificate.entity';
import {
  CreateCertificateInput,
  UpdateCertificateInput,
} from './inputs/certificate.input';
@Resolver()
export class CertificateResolver {
  constructor(private readonly certificateService: CertificateService) {}

  @Query(() => GetCertificateType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyCertificates(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Certificate>,
    @CurrentQuery() query: string,
  ) {
    return this.certificateService.getMany(qs, query);
  }

  @Query(() => Certificate)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneCertificate(
    @Args({ name: 'input' })
    qs: GetOneInput<Certificate>,
    @CurrentQuery() query: string,
  ) {
    return this.certificateService.getOne(qs, query);
  }

  // @Mutation(() => Certificate)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  // async createCertificate(@Args('input') input: CreateCertificateInput) {
  //   return this.certificateService.create(input);
  // }

  @Mutation(() => Certificate)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  async createCertificate(
    @Args('input') input: CreateCertificateInput,
    @Args('transactionId') transactionId: string,
  ) {
    return this.certificateService.createCertificateWithTransaction(
      input,
      transactionId,
    );
  }

  @Mutation(() => [Certificate])
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createManyCertificate(
    @Args({ name: 'input', type: () => [CreateCertificateInput] })
    input: CreateCertificateInput[],
  ) {
    return this.certificateService.createMany(input);
  }

  @Mutation(() => Certificate)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateCertificate(
    @Args('id') id: number,
    @Args('input') input: UpdateCertificateInput,
  ) {
    return this.certificateService.update(id, input);
  }

  @Mutation(() => Certificate)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteCertificate(@Args('id') id: number) {
    return this.certificateService.delete(id);
  }
}
