import { Controller, Logger, Req, Get, Query } from '@nestjs/common';
import { returnSucceed, Result, returnError } from '@bytetrade/core';
import { SecretService } from './secret.service';
//import { createInstance } from './bfl/utils';
import { DeviceService } from './device.service';
import { AppService, AppInfo } from './app.service';
import { WallpaperService } from './wallpaper.service';
import { InitService } from './init.service';
@Controller('/api')
export class InitController {
  private readonly logger = new Logger(InitController.name);

  constructor(
    private secretService: SecretService,
    private deviceService: DeviceService,
    private appService: AppService,
    private initService: InitService,
    private wallpaperService: WallpaperService,
  ) {
    //
  }

  async getApplications(): Promise<AppInfo[]> {
    const apps = await this.appService.GetMyApps();
    return apps;
  }

  @Get('/myapps')
  async myapps(): Promise<any> {
    const applicationData = await this.getApplications();
    this.logger.debug('/myapps');
    this.logger.debug(applicationData);

    return returnSucceed(applicationData);
  }

  @Get('/checkLastOsVersion')
  async checkLastVersions(
    @Query('dev_mode') dev_mode,
    @Query('is_force') is_force,
  ): Promise<Result<string>> {
    console.log('checkLastOsVersion ' + dev_mode);
    let os =
      dev_mode === 'true'
        ? this.initService.devVersion
        : this.initService.noDevVersion;
    console.log('checkLastOsVersion os: ' + os);
    if (is_force === 'true') {
      os = await this.initService.getOSVersion(dev_mode === 'true');
    }

    if (!os) {
      return returnError(1, 'Get OS new version failed');
    }
    return returnSucceed(os);
  }

  @Get('/init')
  async init(): Promise<any> {
    let applicationData = [];
    try {
      applicationData = await this.getApplications();
    } catch (e) {
      console.log(e);
    }
    const secrets = await this.secretService.ListSecret();
    const devices = await this.deviceService.getMergedDevice();
    const terminusInfo = await this.secretService.updateTerminusInfo();
    const wallpaper = this.wallpaperService.wallpaper;

    const msg = {
      terminusInfo: terminusInfo,
      userInfo: this.secretService.userInfo,
      applicationData: applicationData,
      secrets: secrets,
      devices: devices,
      wallpaper: wallpaper,
    };
    //console.log(msg);

    return returnSucceed(msg);
  }
}
