import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';
import { GraphqlPassportAuthGuard } from '@/modules/guards/graphql-passport-auth.guard';
import { CurrentUser } from '@/modules/decorators/user.decorator';
import { User } from '@/user/entities/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/esewa-success')
  @UseGuards(new GraphqlPassportAuthGuard())
  async eSewaSuccess(
    @Query() query: any,
    @Res() response: any,
    @CurrentUser() user: User,
  ) {
    await this.paymentService.checkEsewaSuccess(query, user);
    const returnUrl = process.env.ESEWA_RETURN_URL;
    response.redirect(`${returnUrl}?data=${query.data}`, 301);
  }

  @Get('/khalti-sucess')
  @UseGuards(new GraphqlPassportAuthGuard())
  async khaltiSucess(
    @Query() query: any,
    @Res() response: any,
    @CurrentUser() user: User,
  ) {
    if (query.status == 'Completed') {
      const data = await this.paymentService.handleKhaltiSucess(query, user);
      const returnUrl = process.env.KHALTI_RETURN_URL;
      response.redirect(`${returnUrl}?data=${data}`, 301);
    } else {
      const returnUrl = process.env.PAYMENT_FAILURE_URL;
      response.redirect(`${returnUrl}`, 301);
    }
  }
}
