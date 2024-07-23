import {
  Controller,
  Logger,
  Post,
  Body,
  HttpCode,
  Get,
  Delete,
  Put,
  Param,
} from '@nestjs/common';

import {
  Result,
  ProviderRequest,
  returnError,
  Secret,
  returnSucceed,
} from '@bytetrade/core';
import { AccountService } from './account.service';
import { IntegrationAccount, IntegrationAccountMiniData } from './utils';
import { SecretService } from './secret.service';

@Controller('/api/account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    private accountService: AccountService,
    private secretService: SecretService,
  ) {
    //
  }

  @Post('/')
  @HttpCode(200)
  async getAccountByProvider(
    @Body() data: ProviderRequest<string>,
  ): Promise<Result<Secret>> {
    this.logger.log('getAccountByProvider');
    this.logger.log(data);
    const name = data.data;
    this.logger.log(name);
    try {
      const res: IntegrationAccount | undefined =
        await this.accountService.getIntegrationAccountFullInfoByKey(name);
      if (res) {
        return returnSucceed({ name, value: JSON.stringify(res.raw_data) });
      } else {
        return returnError(1, '');
      }
    } catch (e) {
      console.log(e);
      return returnError(1, '');
    }
  }

  @Post('/create')
  async CreateOrUpdateAccount(
    @Body() raw_account: IntegrationAccount,
  ): Promise<Result<null>> {
    this.logger.debug('/create', raw_account);

    if (raw_account.raw_data.available == undefined) {
      raw_account.raw_data.available = true;
    }
    raw_account.raw_data.create_at = new Date().getTime();

    const account = this.accountService.getInstanceByData(
      raw_account.name,
      raw_account.type,
      raw_account.raw_data,
    );

    await this.accountService.updateIntegrationAccount(account);
    return returnSucceed(null);
  }

  @Get('/:account_type/:name?')
  async RetrieveAccount(
    @Param('account_type') account_type,
    @Param('name') name,
  ): Promise<Result<Secret>> {
    this.logger.debug('get accounts ', account_type);

    if (account_type == 'all') {
      return returnSucceed(
        await this.accountService.getAllIntegrationAccount(),
      );
    } else {
      return returnSucceed(
        await this.accountService.getIntegrationAccountByAccountType(
          account_type,
          name,
        ),
      );
    }
  }

  @Post('/retrieve')
  @HttpCode(200)
  async RetrieveAccountByName(
    @Body() { name }: { name: string },
  ): Promise<Result<Secret>> {
    this.logger.log('RetrieveAccountByName');
    this.logger.log(name);
    try {
      const res: IntegrationAccount | undefined =
        await this.accountService.getIntegrationAccountFullInfoByKey(name);
      if (res) {
        return returnSucceed({ name, value: JSON.stringify(res.raw_data) });
      } else {
        return returnError(1, '');
      }
    } catch (e) {
      console.log(e);
      return returnError(1, '');
    }
  }

  @Get('/all')
  async ListAllAccount(): Promise<Result<IntegrationAccountMiniData[]>> {
    this.logger.debug('ListAllAccount ');

    return returnSucceed(await this.accountService.getAllIntegrationAccount());
  }

  @Delete('/:key')
  async DeleteAccount(@Param('key') key): Promise<Result<null>> {
    this.logger.debug('/delete', key);

    return returnSucceed(
      await this.accountService.removeIntegrationAccount(key),
    );
  }
}
