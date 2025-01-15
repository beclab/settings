import {
  Controller,
  Logger,
  Get,
  Post,
  Req,
  Body,
  Query,
} from '@nestjs/common';
import { createInstance } from './utils';

@Controller('/api/acl')
export class AclController {
  private readonly logger = new Logger(AclController.name);

  @Get('/ssh/status')
  async getSshStatus(@Req() request: Request): Promise<any> {
    this.logger.debug('ssh Status');
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/headscale/ssh/acl',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/ssh/enable')
  async sshEnable(@Req() request: Request, @Body() body: any): Promise<any> {
    this.logger.debug('ssh Enable');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/headscale/enable/ssh',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/ssh/disable')
  async sshDisable(@Req() request: Request, @Body() body: any): Promise<any> {
    this.logger.debug('sshDisable');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/headscale/disable/ssh',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/app/status')
  async getAppAclStatus(
    @Req() request: Request,
    @Query('name') appName,
  ): Promise<any> {
    this.logger.debug('get app acl status');

    this.logger.debug(`app name: ${appName}`);

    if (!appName) {
      throw new Error('app name required');
    }

    const data: any = await createInstance(request).get(
      `/bfl/settings/v1alpha1/headscale/${appName}/acl`,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/app/status')
  async setAppAclStatus(
    @Req() request: Request,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('set app acl status');
    this.logger.debug(body);

    const appName = body.name;
    this.logger.debug(`app name: ${appName}`);

    if (!appName) {
      throw new Error('app name required');
    }

    const data: any = await createInstance(request).post(
      `/bfl/settings/v1alpha1/headscale/${appName}/acl`,
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }
}
