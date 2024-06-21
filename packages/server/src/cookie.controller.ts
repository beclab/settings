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
export class CookieController implements OnModuleInit {
  private readonly logger = new Logger(CookieController.name);

  cookies: DomainCookie[] = [];

  constructor(private secretService: SecretService) {
    //
  }

  async onModuleInit(): Promise<void> {
    const secrets: Secret[] = await this.secretService.ListSecret();
    for (const secret of secrets) {
      if (!secret.name.startsWith('cookie:')) {
        continue;
      }

      await this.updateCookie(JSON.parse(secret.value), false);
    }

    console.log(this.cookies);
  }

  async updateCookie(c: DomainCookie, need_update: boolean) {
    const found = this.cookies.find(
      (a) => a.get_store_key() == c.get_store_key(),
    );
    if (found) {
      this.cookies = this.cookies.map((a) => {
        if (a.get_store_key() == c.get_store_key()) {
          return c;
        }
        return a;
      });
      if (need_update) {
        await this.secretService.UpdateSecret(
          c.get_store_key(),
          JSON.stringify(c),
        );
      }
    } else {
      this.cookies.push(c);
      if (need_update) {
        await this.secretService.CreateSecret(
          c.get_store_key(),
          JSON.stringify(c),
        );
      }
    }
  }

  @Post('/')
  async CreateOrUpdateCookie(
    @Body() raw_cookie: DomainCookie,
  ): Promise<Result<null>> {
    this.logger.debug('/create', raw_cookie);

    await this.CreateOrUpdateCookie(raw_cookie);
    return returnSucceed(null);
  }

  @Get('/:domain')
  async RetrieveAccount(@Param('domain') domain): Promise<Result<Secret>> {
    this.logger.debug('get cookies ', domain);

    return returnSucceed(this.cookies.filter((a) => a.domain == domain));
  }

  @Delete('/:key')
  async DeleteCookie(@Param('key') key): Promise<Result<null>> {
    this.logger.debug('/delete', key);

    this.cookies = this.cookies.filter((a) => a.get_store_key() != key);
    await this.secretService.DeleteSecret(key);
    return returnSucceed(null);
  }
}
