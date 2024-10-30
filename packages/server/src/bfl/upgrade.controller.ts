import { Controller, Logger, Get, Req } from '@nestjs/common';
import { createInstance } from './utils';

const DEV_MODE = !!process.env.DEV_MODE || false;

@Controller('/api/upgrade')
export class UpgradeController {
  private readonly logger = new Logger(UpgradeController.name);

  @Get('/')
  async upgrade(@Req() request: Request): Promise<any> {
    this.logger.debug('upgrade ' + DEV_MODE);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/upgrade' + '?dev_mode=' + DEV_MODE,
      {},
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/state')
  async state(@Req() request: Request): Promise<any> {
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/upgrade/state' + '?dev_mode=' + DEV_MODE,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }
}
