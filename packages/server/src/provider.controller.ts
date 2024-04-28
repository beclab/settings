import { Controller, Logger, Post, Body } from '@nestjs/common';

import {
  returnSucceed,
  Result,
  ProviderRequest,
  returnError,
  Secret,
} from '@bytetrade/core';
import { SecretService } from './secret.service';

export interface GetAccountSecretRequest {
  name: string;
}

@Controller('/provider')
export class SecretController {
  private readonly logger = new Logger(SecretController.name);

  constructor(private secretService: SecretService) {
    //
  }

  @Post('/account/secret')
  async get_account_secret(
    @Body() data: ProviderRequest<GetAccountSecretRequest>,
  ): Promise<Result<Secret>> {
    this.logger.debug('get /account/secret');
    this.logger.debug(data);
    const notification = data.data;
    this.logger.debug(notification);

    if (notification.name === 'settings-account-space') {
      const res = await this.secretService.RetrieveSecret(notification.name);
      this.logger.debug(res);
      return returnSucceed(res);
    } else {
      return returnError(500, 'No Permission');
    }
  }
}
