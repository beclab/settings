import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SecretService } from './secret.service';
import axios from 'axios';
import * as qs from 'qs';
import { Interval } from '@nestjs/schedule';

export interface OSVersion {
  current_version: string;
  new_version: string;
  is_new: boolean;
}

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  devVersion: OSVersion | null = null;
  noDevVersion: OSVersion | null = null;

  constructor(private secretService: SecretService) {
    //
  }

  async onModuleInit(): Promise<void> {
    await this.getOSVersion(true);
    await this.getOSVersion(false);
  }

  async updateLocalVersion() {
    try {
      const terminusInfo = await this.secretService.updateTerminusInfo();
      if (this.devVersion) {
        this.devVersion.current_version = terminusInfo.osVersion;
      }
      if (this.noDevVersion) {
        this.noDevVersion.current_version = terminusInfo.osVersion;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getOSVersion(dev_mode: boolean): Promise<OSVersion | null> {
    const terminusInfo = await this.secretService.updateTerminusInfo();
    try {
      const response: any = await axios.post(
        'https://cloud-api.bttcdn.com/v1/resource/lastVersions',
        qs.stringify({
          versions: terminusInfo.osVersion,
          devMode: dev_mode,
        }),
      );
      console.log(response.data);
      if (response.data.code != 200) {
        return null;
      }
      const ob = {
        current_version: terminusInfo.osVersion,
        new_version: response.data.data.tag,
        is_new: response.data.data.tag != terminusInfo.osVersion,
      };
      if (dev_mode) {
        this.devVersion = ob;
      } else {
        this.noDevVersion = ob;
      }
      return ob;
    } catch (e) {
      return null;
    }
  }

  @Interval(1000 * 3600)
  async refreshOSVerions() {
    this.logger.log('refreshOSVerions');
    await this.getOSVersion(true);
    await this.getOSVersion(false);
  }
}
