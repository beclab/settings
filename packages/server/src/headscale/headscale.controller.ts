import {
  Controller,
  Logger,
  Get,
  Post,
  Param,
  Delete,
  Body,
} from '@nestjs/common';

import { HeadScaleClient } from './headscale.client';
import { returnSucceed } from '@bytetrade/core';

const headScaleClient = new HeadScaleClient();

@Controller('/headscale')
export class HeadScaleController {
  private readonly logger = new Logger(HeadScaleController.name);

  @Get('/machine')
  async machine(): Promise<any> {
    this.logger.debug('/v1/GetMachine');

    return returnSucceed(await headScaleClient.execute('/v1/GetMachine', {}));
  }

  @Post('/machine/:id/rename/:name')
  async renameMachine(@Param('id') id, @Param('name') name): Promise<any> {
    this.logger.debug('/v1/RenameMachine', id, name);

    return returnSucceed(
      await headScaleClient.execute('/v1/RenameMachine', { id, name }),
    );
  }

  @Delete('/machine/:id')
  async deleteMachine(@Param('id') id): Promise<any> {
    this.logger.debug('/v1/DeleteMachine', id);

    return returnSucceed(
      await headScaleClient.execute('/v1/DeleteMachine', { id }),
    );
  }

  @Get('/machine/:id/routes')
  async getRoute(@Param('id') id): Promise<any> {
    this.logger.debug('/v1/GetRoute', id);

    return returnSucceed(await headScaleClient.execute('/v1/GetRoute', { id }));
  }

  @Post('/routes/:id/enable')
  async enableRoute(@Param('id') id): Promise<any> {
    this.logger.debug('/v1/EnableRoute', id);

    return returnSucceed(
      await headScaleClient.execute('/v1/EnableRoute', { id }),
    );
  }

  @Post('/routes/:id/disable')
  async disableRoute(@Param('id') id): Promise<any> {
    this.logger.debug('/v1/DisableRoute', id);

    return returnSucceed(
      await headScaleClient.execute('/v1/DisableRoute', { id }),
    );
  }

  @Post('/machine/:id/tags')
  async setRouteTags(
    @Param('id') id,
    @Body() { tags }: { tags: string[] },
  ): Promise<any> {
    this.logger.debug('/v1/SetTags');
    this.logger.debug(id);
    this.logger.debug(tags);

    return returnSucceed(
      await headScaleClient.execute('/v1/SetTags', { id, tags }),
    );
  }
}
