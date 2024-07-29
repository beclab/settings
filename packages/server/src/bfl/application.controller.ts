import {
  Controller,
  Logger,
  Get,
  Post,
  Req,
  Param,
  Body,
} from '@nestjs/common';
import { createInstance } from './utils';
import { Cron } from '@nestjs/schedule';

@Controller('/api/applications')
export class ApplicationController {
  private readonly logger = new Logger(ApplicationController.name);

  private permissionApplicationNameRedirect = {
    market: 'appstore',
  };

  // @Get('/')
  // async get_applications(@Req() request: Request): Promise<any> {
  //   this.logger.debug('get_applications');
  //   const data: any = await createInstance(request).get(
  //     '/bfl/app_process/v1alpha1/myapps',
  //   );
  //   if (data.status !== 200) {
  //     throw new Error(data.statusText);
  //   }
  //   //this.logger.debug(data.data);
  //   return data.data;
  // }

  // @Get('/:name/entrances_all')
  // async entrances_all(
  //   @Req() request: Request,
  //   @Param('name') name: string,
  // ): Promise<any> {
  //   this.logger.debug('entrances_all');
  //   const entrances_data: any = await createInstance(request).get(
  //     '/bfl/settings/v1alpha1/applications/' + name + '/entrances',
  //   );
  //   if (entrances_data.status !== 200) {
  //     throw new Error(entrances_data.statusText);
  //   }
  //   this.logger.debug(entrances_data.data.items);

  // }

  @Get('/:name/entrances')
  async entrances(
    @Req() request: Request,
    @Param('name') name: string,
  ): Promise<any> {
    this.logger.debug('entrances');
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/applications/' + name + '/entrances',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:name/:entrance/setup/policy')
  async get_appFa2(
    @Req() request: Request,
    @Param('name') name: string,
    @Param('entrance') entrance: string,
  ): Promise<any> {
    this.logger.debug('get_appFa2 ' + name + ' ' + entrance);
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/applications/' + name + '/setup/policy',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    if (entrance in data.data.data) {
      return { code: 0, data: data.data.data[entrance], message: '' };
    } else {
      return {
        code: 0,
        data: {
          default_policy: 'one_factor',
          one_time: false,
          sub_policies: null,
          valid_duration: 0,
        },
        message: '',
      };
    }
  }

  @Post('/:name/:entrance/setup/policy')
  async set_appFa2(
    @Req() request: Request,
    @Param('name') name: string,
    @Param('entrance') entrance: string,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('set_appFa2');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/applications/' +
        name +
        '/' +
        entrance +
        '/setup/policy',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/:name/:entrance/setup/domain')
  async setup_domain(
    @Req() request: Request,
    @Param('name') name: string,
    @Param('entrance') entrance: string,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('setup_domain ' + name + ' ' + entrance);
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/applications/' +
        name +
        '/' +
        entrance +
        '/setup/domain',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:name/:entrance/setup/domain')
  async get_domain(
    @Req() request: Request,
    @Param('name') name: string,
    @Param('entrance') entrance: string,
  ): Promise<any> {
    this.logger.debug('get_domain ' + name);
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/applications/' + name + '/setup/domain',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }

    this.logger.debug(data.data);
    if (
      data.data.code == 1 &&
      data.data.message == 'app has not set custom domain'
    ) {
      return { code: 0, data: {}, message: '' };
    }

    if (entrance in data.data.data) {
      return { code: 0, data: data.data.data[entrance], message: '' };
    } else {
      return {
        code: 0,
        data: {},
        message: '',
      };
    }
  }

  @Get('/:name/:entrance/setup/domain/finish')
  async set_cname(
    @Req() request: Request,
    @Param('name') name: string,
    @Param('entrance') entrance: string,
  ): Promise<any> {
    this.logger.debug('set_cname ' + name);
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/applications/' +
        name +
        '/' +
        entrance +
        '/setup/domain/finish',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }

    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/:name/:entrance_name/setup/auth-level')
  async setup_auth_level(
    @Req() request: Request,
    @Param('name') name: string,
    @Param('entrance_name') entrance_name: string,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('setup_auth_level');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/applications/' +
        name +
        '/' +
        entrance_name +
        '/setup/auth-level',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }

    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/permissions/:name')
  async permissions(
    @Req() request: Request,
    @Param('name') name,
  ): Promise<any> {
    this.logger.debug('application permissions');
    let realName = name;
    if (name && this.permissionApplicationNameRedirect[name]) {
      realName = this.permissionApplicationNameRedirect[name];
    }
    const path = '/bfl/settings/v1alpha1/apps/permissions/' + realName;
    const data: any = await createInstance(request).get(path);
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/provider-registry/:dataType/:group/:version')
  async providerRegistry(
    @Req() request: Request,
    @Param('dataType') dataType,
    @Param('group') group,
    @Param('version') version,
  ): Promise<any> {
    this.logger.debug('Provider Registry');
    const path =
      '/bfl/settings/v1alpha1/apps/provider-registry/' +
      dataType +
      '/' +
      group +
      '/' +
      version;
    const data: any = await createInstance(request).get(path);
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }
}
