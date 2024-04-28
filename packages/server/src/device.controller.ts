import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import {
  returnSucceed,
  Result,
  TermiPassDeviceInfo,
  returnError,
} from '@bytetrade/core';
import { DeviceService } from './device.service';
import { extractToken, createInstance, createAuthInstance } from './bfl/utils';
import { SecretService } from './secret.service';
import { Encoder, SSOToken, VaultActiveSessionInfo } from '@bytetrade/core';

interface SSORaw {
  token: string;
  userName: string;
  authLevel: string;
  firstFactorTimestamp: number;
  secondFactorTimestamp: number;
}

interface SSOTokenRaw {
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  token_type: string;
  username: string;
  extra: {
    uninitialized: string[];
  };
}

@Controller('/api/device')
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);

  constructor(
    private deviceService: DeviceService,
    private secretService: SecretService,
  ) {
    //
  }

  @Post('/')
  async updateDevice(
    @Req() request: Request,
    @Body() body: any,
  ): Promise<Result<null>> {
    this.logger.log('updateDevice');
    this.logger.log(body);
    this.logger.log(request.headers);
    //const ip = requestIp.getClientIp(request as any);
    const ip = request.headers['x-real-ip'];
    this.logger.debug('ip ' + ip);

    let sso = extractToken(request);
    this.logger.log(sso);
    if (sso) {
      sso = sso.split('.')[1];
    }

    let index = this.deviceService.termiPasses.findIndex(
      (item) => item.id === body.id,
    );
    if (index < 0) {
      this.deviceService.termiPasses.push(body);
      index = this.deviceService.termiPasses.length - 1;

      this.deviceService.termiPasses[index].createTime = Math.floor(
        new Date().getTime() / 1000,
      );
    } else {
      this.deviceService.termiPasses[index] = body;
    }

    if (sso) {
      this.deviceService.termiPasses[index].sso = sso;
    }

    this.deviceService.termiPasses[index].lastIp = ip;

    //if (ip) {
    //   try {
    //     const cityResponse = await getLocation(ip);
    //     this.logger.log(cityResponse);
    //     if (cityResponse) {
    //       this.deviceService.termiPasses[index].lastIpLocation =
    //         cityResponse.city.names.en;
    //     } else {
    //       this.deviceService.termiPasses[index].lastIpLocation = ip
    //         ? ip
    //         : 'Unknown';
    //     }
    //   } catch (e) {
    //     console.log(e);
    //     this.deviceService.termiPasses[index].lastIpLocation = ip
    //       ? ip
    //       : 'Unknown';
    //   }
    // } else {
    //   this.deviceService.termiPasses[index].lastIpLocation = ip
    //     ? ip
    //     : 'Unknown';
    // }

    this.deviceService.termiPasses[index].lastSeenTime = Math.floor(
      new Date().getTime() / 1000,
    );

    await this.deviceService.saveTermiPasses();
    return returnSucceed(null);
  }

  @Get('/')
  async getRawDevices(): Promise<Result<TermiPassDeviceInfo[]>> {
    this.logger.log('getDevices');
    const devices = await this.deviceService.termiPasses;

    return returnSucceed(devices);
  }

  @Get('/vault')
  async getVaultTrustDevices(
    @Req() request: Request,
  ): Promise<Result<TermiPassDeviceInfo[]>> {
    try {
      this.logger.log('getVaultTrustDevices');
      this.logger.log(this.secretService.terminusInfo);
      const url =
        'http://vault-server:3010/vault/trust_device/' +
        this.secretService.terminusInfo.terminusName.split('@')[0];
      const response = await createInstance(request).get(url);

      this.logger.log(response.data);

      if (response.data.code != 0) {
        return returnSucceed([]);
      }

      const vd = [];
      for (let i = 0; i < response.data.data.length; i++) {
        const data: VaultActiveSessionInfo = JSON.parse(response.data.data[i]);
        vd.push(data);
      }
      return returnSucceed(vd);
    } catch (e) {
      this.logger.log(e);
      return returnSucceed([]);
    }
  }

  async getSSOTokens(@Req() request: Request) {
    const name = this.secretService.terminusInfo.terminusName.split('@')[0];

    const response = await createAuthInstance(request, name).get(
      '/api/usertokens?user=' + name,
    );

    this.logger.log(response.data);

    if (response.data.status != 'OK') {
      return [];
    }

    return response.data.data;
  }

  @Get('/sso')
  async getSSOInfo(
    @Req() request: Request,
  ): Promise<Result<TermiPassDeviceInfo[]>> {
    try {
      this.logger.log('getSSOInfo');
      this.logger.log(this.secretService.terminusInfo);

      const tokens = await this.getSSOTokens(request);

      const vd = [];
      for (let i = 0; i < tokens.length; i++) {
        const raw: SSORaw = tokens[i];
        const token: SSOTokenRaw = JSON.parse(
          Encoder.bytesToString(
            Encoder.base64UrlToBytes(raw.token.split('.')[1]),
          ),
        );
        this.logger.log(token);

        const sso: SSOToken = {
          expireTime: token.exp,
          createTime: token.iat,
          tokenType: token.token_type,
          username: token.username,
          uninitialized:
            token.extra?.uninitialized?.length > 0
              ? token.extra.uninitialized[0]
              : 'false',
          authLevel: raw.authLevel,
          firstFactorTimestamp: raw.firstFactorTimestamp,
          secondFactorTimestamp: raw.secondFactorTimestamp,
        };

        const termiPass = this.deviceService.termiPasses.find(
          (item) => item.sso == raw.token.split('.')[1],
        );
        const result = {
          sso,
          termiPass,
        };

        vd.push(result);
      }
      return returnSucceed(vd);
    } catch (e) {
      console.log(e);
      return returnSucceed([]);
    }
  }

  @Delete('/sso/:token')
  async revokeSSOToken(
    @Req() request: Request,
    @Param('token') token,
  ): Promise<Result<null>> {
    this.logger.log('status');
    try {
      const tokens = await this.getSSOTokens(request);

      const name = this.secretService.terminusInfo.terminusName.split('@')[0];

      for (let i = 0; i < tokens.length; i++) {
        console.log(tokens[i].token);
        if (tokens[i].token.split('.')[1] == token) {
          const response = await createAuthInstance(request, name).post(
            '/api/revoke-token',
            {
              revokeToken: tokens[i].token,
            },
          );
          this.logger.log(response.data);
        }

        // this.logger.log(response.data);

        // if (response.data.status != 'OK') {
        //   return returnSucceed(null);
        // }
        // return returnError(1, response.data.status);
      }
      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(1, e.message || 'revoke token failed');
    }
  }
}
