import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SecretService } from './secret.service';
import axios from 'axios';
import * as qs from 'qs';
import { Cloud_URL } from './utils';

export interface OSVersion {
  current_version: string;
  new_version: string;
  is_new: boolean;
}

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  //   devVersion: OSVersion | null = null;
  //   noDevVersion: OSVersion | null = null;

  private cloudUrl = process.env.OLARES_SPACE_URL || Cloud_URL;

  constructor(private secretService: SecretService) {
    //
  }

  async onModuleInit(): Promise<void> {
    await this.getOSVersion(true);
    await this.getOSVersion(false);
  }

  //   async updateLocalVersion() {
  //     try {
  //       const terminusInfo = await this.secretService.updateTerminusInfo();
  //       if (this.devVersion) {
  //         this.devVersion.current_version = terminusInfo.osVersion;
  //       }
  //       if (this.noDevVersion) {
  //         this.noDevVersion.current_version = terminusInfo.osVersion;
  //       }
  //       return true;
  //     } catch (e) {
  //       console.log(e);
  //       return false;
  //     }
  //   }

  async getOSVersion(dev_mode: boolean): Promise<OSVersion | null> {
    console.log('dev_mode --->', dev_mode);
    console.log(' this.cloudUrl ---->', this.cloudUrl);

    const terminusInfo = await this.secretService.updateTerminusInfo();
    try {
      const response: any = await axios.post(
        this.cloudUrl + '/v1/resource/lastVersions',
        qs.stringify({
          versions: terminusInfo.osVersion,
          devMode: dev_mode,
        }),
      );
      console.log(response.data);
      if (response.data.code != 200) {
        return {
          current_version: terminusInfo.osVersion,
          new_version: terminusInfo.osVersion,
          is_new: false,
        };
      }
      const ob = {
        current_version: terminusInfo.osVersion,
        new_version:
          response.data && response.data.data && response.data.data.tag
            ? response.data.data.tag
            : terminusInfo.osVersion,
        is_new:
          response.data &&
          response.data.data &&
          response.data.data.tag &&
          response.data.data.tag != terminusInfo.osVersion,
      };
      //   if (dev_mode) {
      //     this.devVersion = ob;
      //   } else {
      //     this.noDevVersion = ob;
      //   }
      return ob;
    } catch (e) {
      return null;
    }
  }

  //   @Interval(1000 * 3600)
  //   async refreshOSVerions() {
  //     this.logger.log('refreshOSVerions');
  //     await this.getOSVersion(true);
  //     await this.getOSVersion(false);
  //   }
}
