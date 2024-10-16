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
    response.redirect(
      `http://localhost:3000/payment-sucess/esewa?data=${query.data}`,
      301,
    );
  }
}
