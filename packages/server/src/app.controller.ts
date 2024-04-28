import { Controller, Logger, Param, Req, Get } from '@nestjs/common';
import { createInstance } from './bfl/utils';
import { Result, returnError, returnSucceed } from '@bytetrade/core';

const appServiceUrl =
  'http://' +
  process.env.APP_SERVICE_SERVICE_HOST +
  ':' +
  process.env.APP_SERVICE_SERVICE_PORT;
console.log('appServiceUrl ' + appServiceUrl);

@Controller('/api/app')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor() {
    //
  }

  @Get('/resume/:name')
  async resume(
    @Req() request: Request,
    @Param('name') name,
  ): Promise<Result<string>> {
    this.logger.log('resume');
    try {
      const res: any = await createInstance(request).post(
        appServiceUrl + '/app-service/v1/apps/' + name + '/resume',
        {
          headers: {
            Accept: '*/*',
          },
        },
      );
      //console.log(JSON.stringify(res, null, 2));

      if (!res || res.status != 200 || !res.data) {
        throw Error('uninstall app failed! res status != 200');
      }

      if (res.data.code != 200) {
        console.log(res.data);
        throw Error('uninstall app failed! res code != 200');
      }
      return returnSucceed({ code: 0, data: res.data.data });
    } catch (e) {
      console.log(e);
      return returnError(1, e.message || 'uninstall app failed');
    }
  }

  @Get('/suspend/:name')
  async suspend(
    @Req() request: Request,
    @Param('name') name,
  ): Promise<Result<string>> {
    this.logger.log('suspend');
    try {
      const res: any = await createInstance(request).post(
        appServiceUrl + '/app-service/v1/apps/' + name + '/suspend',
        {
          headers: {
            Accept: '*/*',
          },
        },
      );
      //console.log(JSON.stringify(res, null, 2));

      if (!res || res.status != 200 || !res.data) {
        throw Error('uninstall app failed! res status != 200');
      }

      if (res.data.code != 200) {
        console.log(res.data);
        throw Error('uninstall app failed! res code != 200');
      }
      return returnSucceed({ code: 0, data: res.data.data });
    } catch (e) {
      console.log(e);
      return returnError(1, e.message || 'uninstall app failed');
    }
  }

  @Get('/status/:name')
  async status(
    @Req() request: Request,
    @Param('name') name,
  ): Promise<Result<string>> {
    this.logger.log('status');
    try {
      const res: any = await createInstance(request).get(
        appServiceUrl + '/app-service/v1/apps/' + name + '/status',
        {
          headers: {
            Accept: '*/*',
          },
        },
      );
      console.log('status' + res.status);
      console.log(res.data);

      if (!res || res.status != 200 || !res.data) {
        throw Error('uninstall app failed! res status != 200');
      }

      return returnSucceed(res.data);
    } catch (e) {
      console.log(e);
      return returnError(1, e.message || 'uninstall app failed');
    }
  }
}
