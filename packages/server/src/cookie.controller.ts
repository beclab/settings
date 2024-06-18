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

@Controller('/api/cookie')
export class CookieController implements OnModuleInit {
  private readonly logger = new Logger(CookieController.name);

  constructor(private secretService: SecretService) {
    //
  }

  async onModuleInit(): Promise<void> {
    //
  }

  @Post('/')
  async NewCookie(
    @Body()
    {
      website,
      account,
      value,
    }: {
      website: string;
      account?: string;
      value: string;
    },
  ): Promise<Result<null>> {
    this.logger.debug('/create', name, value);

    // await this.secretService.CreateSecret(name, value);
    return returnSucceed(null);
  }

  @Get('/:name')
  async RetrieveCookie(@Param('name') name): Promise<Result<Secret>> {
    this.logger.debug('/name', name);

    return returnSucceed(await this.secretService.RetrieveSecret(name));
  }

  @Delete('/:name')
  async DeleteCookie(@Param('name') name): Promise<Result<null>> {
    this.logger.debug('/delete', name);

    await this.secretService.DeleteSecret(name);
    return returnSucceed(null);
  }

  @Put('/')
  async UpdateCookie(
    @Body() { name, value }: { name: string; value: string },
  ): Promise<Result<null>> {
    this.logger.debug('/put', name, value);

    await this.secretService.UpdateSecret(name, value);
    return returnSucceed(null);
  }

  @Get('/')
  async ListCookies(): Promise<Result<Secret[]>> {
    this.logger.debug('/list');

    return returnSucceed(await this.secretService.ListSecret());
  }
}
