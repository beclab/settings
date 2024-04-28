import { Controller, Logger, Post, Body, HttpCode } from '@nestjs/common';

import { Result, ProviderRequest, returnError, Secret } from '@bytetrade/core';
import { SecretService } from './secret.service';

@Controller('/api/account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private secretService: SecretService) {
    //
  }

  @Post('/')
  @HttpCode(200)
  async getAccount(
    @Body() data: ProviderRequest<string>,
  ): Promise<Result<Secret>> {
    this.logger.log('getaccount');
    this.logger.log(data);
    const name = data.data;
    this.logger.log(name);
    try {
      const res: any = await this.secretService.RetrieveSecret(name);
      console.log(res);
      if (res.code == 0) {
        return res.data;
      } else {
        return returnError(1, '');
      }
    } catch (e) {
      console.log(e);
      return returnError(1, '');
    }
  }
}
