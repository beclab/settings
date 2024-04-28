import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { returnSucceed, Result, Secret } from '@bytetrade/core';
import { SecretService } from './secret.service';

@Controller('/api/secret')
export class SecretController {
  private readonly logger = new Logger(SecretController.name);

  constructor(private secretService: SecretService) {
    //
  }

  @Post('/')
  async CreateSecret(
    @Body() { name, value }: { name: string; value: string },
  ): Promise<Result<null>> {
    this.logger.debug('/create', name, value);

    await this.secretService.CreateSecret(name, value);
    return returnSucceed(null);
  }

  @Get('/:name')
  async RetrieveSecret(@Param('name') name): Promise<Result<Secret>> {
    this.logger.debug('/name', name);

    return returnSucceed(await this.secretService.RetrieveSecret(name));
  }

  @Delete('/:name')
  async DeleteSecret(@Param('name') name): Promise<Result<null>> {
    this.logger.debug('/delete', name);

    await this.secretService.DeleteSecret(name);
    return returnSucceed(null);
  }

  @Put('/')
  async UpdateSecret(
    @Body() { name, value }: { name: string; value: string },
  ): Promise<Result<null>> {
    this.logger.debug('/put', name, value);

    await this.secretService.UpdateSecret(name, value);
    return returnSucceed(null);
  }

  @Get('/')
  async ListSecret(): Promise<Result<Secret[]>> {
    this.logger.debug('/list');

    return returnSucceed(await this.secretService.ListSecret());
  }
}
