import { Controller, Logger, Get, Query } from '@nestjs/common';
import { returnSucceed, Result, returnError } from '@bytetrade/core';
import { SecretService } from './secret.service';
//import { createInstance } from './bfl/utils';
import { DeviceService } from './device.service';
import { AppService, AppInfo } from './app.service';
import { WallpaperService } from './wallpaper.service';
import { InitService } from './init.service';

const DEV_MODE = !!process.env.DEV_MODE || false;
const DID_GATE_URL =
  process.env.DID_GATE_URL || 'https://did-gate-v3.bttcdn.com';

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
  async checkLastVersions(): Promise<Result<string>> {
    console.log('checkLastOsVersion ' + DEV_MODE);
    // let os =
    //   dev_mode === 'true'
    //     ? this.initService.devVersion
    //     : this.initService.noDevVersion;
    // console.log('checkLastOsVersion os: ' + os);
    // if (is_force === 'true') {
    const os = await this.initService.getOSVersion(DEV_MODE);
    // }

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

    let secrets = [];
    try {
      secrets = await this.secretService.ListSecret();
    } catch (e) {
      console.log(e);
    }
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
      didUrl: DID_GATE_URL,
    };
    //console.log(msg);

    return returnSucceed(msg);
  }
}
