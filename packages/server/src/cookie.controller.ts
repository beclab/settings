import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  OnModuleInit,
} from '@nestjs/common';

import { returnSucceed, Result, Secret } from '@bytetrade/core';
import { SecretService } from './secret.service';
import { DomainCookie } from './utils';

@Controller('/api/cookie')
export class CookieController {
  private readonly logger = new Logger(CookieController.name);

  constructor(private secretService: SecretService) {
    //
  }

  @Post('/')
  async CreateOrUpdateCookie(
    @Body() raw_cookie: DomainCookie,
  ): Promise<Result<null>> {
    this.logger.debug('/create', raw_cookie);

    const rowCookieModel = new DomainCookie(raw_cookie);

    await this.secretService.updateCookie(rowCookieModel, true);
    return returnSucceed(null);
  }

  @Post('/retrieve')
  async RetrieveCookie(
    @Body() { domain }: { domain: string },
  ): Promise<Result<DomainCookie[]>> {
    if (domain) {
      this.logger.debug('get cookies ', domain);

      return returnSucceed(
        this.secretService.cookies.filter((a) => a.domain == domain),
      );
    } else {
      return returnSucceed(this.secretService.cookies);
    }
  }

  @Post('/delete')
  async DeleteCookie(@Body() key: string): Promise<Result<null>> {
    this.logger.debug('/delete', key);

    this.secretService.cookies = this.secretService.cookies.filter(
      (a) => a.get_store_key() != key,
    );
    await this.secretService.DeleteSecret(key);
    return returnSucceed(null);
  }
}
