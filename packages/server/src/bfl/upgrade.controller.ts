import { Controller, Logger, Get, Query, Req } from '@nestjs/common';
import { createInstance } from './utils';

@Controller('/api/upgrade')
export class UpgradeController {
  private readonly logger = new Logger(UpgradeController.name);

  @Get('/')
  async upgrade(
    @Req() request: Request,
    @Query() query: { dev_mode: boolean },
  ): Promise<any> {
    this.logger.debug('upgrade ' + query.dev_mode);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/upgrade' + '?dev_mode=' + query.dev_mode,
      {},
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/state')
  async state(
    @Req() request: Request,
    @Query() query: { dev_mode: boolean },
  ): Promise<any> {
    this.logger.debug('state ' + query.dev_mode);
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/upgrade/state' + '?dev_mode=' + query.dev_mode,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }
}
