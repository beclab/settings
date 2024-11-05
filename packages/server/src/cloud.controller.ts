import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
} from '@nestjs/common';
import {
  Result,
  returnError,
  returnSucceed,
  MessageData,
} from '@bytetrade/core';
import axios, { AxiosInstance } from 'axios';
import { Cloud_URL } from './utils';
import * as qs from 'qs';
import { createSystemMessage, postSystemNotification } from '@bytetrade/core';
import { SecretService } from './secret.service';
import { AccountService } from './account.service';

@Controller('/api/cloud')
export class CloudController {
  private readonly logger = new Logger(CloudController.name);
  private instance: AxiosInstance;

  private signMessage: Record<string, MessageData> = {};
  private rawMessage: Record<string, any> = {};

  private servername = 'settings';
  private chainId = process.env.APP_SERVICE_CHAIN_ID || 10;
  private verifyingContract =
    process.env.APP_SERVICE_VERIFYING_CONTRACT ||
    '0xe2eaba0979277a90511f8873ae1e8ca26b54e740';
  private cloudUrl = process.env.APP_SERVICE_CLOUD_URL || Cloud_URL;

  constructor(
    private secretService: SecretService,
    private accountService: AccountService,
  ) {
    this.instance = axios.create({
      baseURL: this.cloudUrl,
      timeout: 1000 * 10,
      headers: {},
    });
  }

  @Get('/getBindingTerminusNames')
  async getTerminusNames(): Promise<Result<any>> {
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }

    try {
      const response = await this.instance.post(
        '/v1/bind/getTerminusNames',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
        }),
      );

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      this.logger.debug(response.data.data.terminusNames);

      this.logger.debug(response.data.data.terminusNames.length);

      const found = response.data.data.terminusNames.find(
        (f) =>
          f.status == 'Active' &&
          f.terminusName == this.secretService.terminusInfo.terminusName,
      );

      console.log('found');
      console.log(found);

      return returnSucceed(found);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Get('/getNFTAddress')
  async getNFTAddress(): Promise<Result<any>> {
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }

    try {
      const response = await this.instance.post(
        '/v1/bind/getNFTAddress',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
          terminusName: this.secretService.terminusInfo.terminusName,
        }),
      );

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      return returnSucceed(response.data.data);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/requestTerminusName')
  @HttpCode(200)
  async requestTerminusName(@Req() request: Request) {
    const host: string = request.headers['host'];
    console.log('host:' + host);
    const isLocal = host.indexOf('.local.') >= 0;
    console.log('isLocal:' + isLocal);
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }
    const id = '' + new Date().getTime();
    this.signMessage[id] = {
      id: id,
      sign: {
        callback_url:
          'https://' +
          this.servername +
          '.' +
          (isLocal ? 'local.' : '') +
          this.secretService.terminusInfo.terminusName.replace('@', '.') +
          '/api/cloud/sign/bindTerminusNames',
        sign_body: {
          userid: spaceAccountData.userid,
          terminusName: this.secretService.terminusInfo.terminusName,
        },
      },
      vars: {
        terminusName: this.secretService.terminusInfo.terminusName,
      },
    };

    const message = createSystemMessage(
      this.secretService.terminusInfo.terminusName.split('@')[0],
      JSON.stringify({
        eventType: 'settings.bind.space',
      }),
      JSON.stringify(this.signMessage[id]),
    );

    this.logger.log(message);

    const send_result = await postSystemNotification(message);
    console.log('send result ', send_result);
    return returnSucceed(null);
  }

  @Post('/sign/bindTerminusNames')
  @HttpCode(200)
  async bindTerminusNames(
    @Body()
    {
      id,
      did,
      jws,
      terminusName,
      userid,
    }: {
      id: string;
      did: string;
      jws: string;
      terminusName: string;
      userid: string;
    },
  ): Promise<Result<null>> {
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }

    console.log('bindTerminusNames ', id);
    try {
      if (!(id in this.signMessage)) {
        throw new Error('invalid id');
      }
      delete this.signMessage[id];
      delete this.rawMessage[id];

      const response = await this.instance.post(
        '/v1/bind/bindTerminusName',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
          isAdmin: false,
          terminusName,
          jwt: jws,
          did,
        }),
      );

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      console.log(response.data);

      //   await this.gateway.broadcastMessage({
      //     topic: MessageTopic.CANCEL_SIGN,
      //     event: 'bind/cloud',
      //     message: {
      //       id: id,
      //     },
      //   });

      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'settings.cancel.sign',
        }),
        JSON.stringify({
          id: id,
        }),
      );

      const send_result = await postSystemNotification(message);
      console.log('send result ', send_result);

      return returnSucceed(response.data.data);
      //return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/unBindTerminusNames')
  @HttpCode(200)
  async unBindTerminusNames(
    @Body()
    { id }: { id: number },
  ): Promise<Result<null>> {
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }

    try {
      const response = await this.instance.post(
        '/v1/bind/unbindTerminusName',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
          id,
        }),
      );

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      console.log(response.data);

      return returnSucceed(response.data.data);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/getEthAddress')
  @HttpCode(200)
  async getEthAddress(
    @Body()
    { terminusName }: { terminusName?: string },
  ): Promise<Result<null>> {
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }
    try {
      const response = await this.instance.post(
        '/v1/bind/getEthAddress',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
          terminusName,
        }),
      );
      console.log(response.data);

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      return returnSucceed(response.data.data);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/requestTermiPassSignEthAddress')
  @HttpCode(200)
  async requestTermiPassSignEthAddress(
    @Req() request: Request,
    @Body()
    {
      sigFromAddressPrivKey,
      signData,
      uuid,
    }: {
      sigFromAddressPrivKey?: string;
      signData: {
        action: number;
        addr: string;
        algorithm: number;
        domain: string;
        signAt: number;
      };
      uuid: string;
    },
  ): Promise<Result<null>> {
    const host: string = request.headers['host'];
    console.log('host:' + host);
    const isLocal = host.indexOf('.local.') >= 0;
    console.log('isLocal:' + isLocal);
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }
    if (
      signData.domain !=
      this.secretService.terminusInfo.terminusName.replace('@', '.')
    ) {
      return returnError(500, 'Olares ID is not match');
    }

    try {
      const id = '' + new Date().getTime();
      this.signMessage[id] = {
        id: id,
        sign: {
          callback_url:
            'https://' +
            this.servername +
            '.' +
            (isLocal ? 'local.' : '') +
            this.secretService.terminusInfo.terminusName.replace('@', '.') +
            '/api/cloud/sign/bindEthAddress',
          sign_body: {
            userid: spaceAccountData.userid,
            terminusName: this.secretService.terminusInfo.terminusName,
          },
          sign_eth: {
            domain: {
              name: 'Terminus DID Root Tagger',
              version: '1',
              chainId: this.chainId,
              verifyingContract: this.verifyingContract,
            },
            types: {
              EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
              ],
              AuthAddressReq: [
                { name: 'addr', type: 'address' },
                { name: 'algorithm', type: 'uint8' },
                { name: 'domain', type: 'string' },
                { name: 'signAt', type: 'uint256' },
                { name: 'action', type: 'uint8' },
              ],
            },
            data: signData,
            primaryType: 'AuthAddressReq',
          },
        },
        vars: {
          terminusName: this.secretService.terminusInfo.terminusName,
          address: signData.addr,
        },
      };

      this.rawMessage[id] = {
        sigFromAddressPrivKey,
        signData,
        uuid,
        address: signData.addr,
      };

      //payload
      //await this.gateway.broadcastMessage(this.signMessage[id]);
      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'settings.bind.ethereum',
        }),
        JSON.stringify(this.signMessage[id]),
      );

      this.logger.log(message);

      const send_result = await postSystemNotification(message);
      console.log('send result ', send_result);

      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/bindEthAddress')
  @HttpCode(200)
  async bindEthAddress(
    @Body()
    {
      id,
      did,
      jws,
      terminusName,
      userid,
      eth721_sign,
    }: {
      id: string;
      did: string;
      jws: string;
      terminusName: string;
      userid: string;
      eth721_sign: string;
    },
  ): Promise<Result<null>> {
    try {
      const spaceAccountData = this.accountService.getSpaceAccount();
      if (!spaceAccountData) {
        return returnError(1, 'Terminus Space not loggin');
      }
      if (!(id in this.signMessage)) {
        throw new Error('invalid id');
      }
      delete this.signMessage[id];

      const sigFromAddressPrivKey = this.rawMessage[id].sigFromAddressPrivKey;
      const signData = this.rawMessage[id].signData;
      const uuid = this.rawMessage[id].uuid;
      const address = this.rawMessage[id].address;

      const response = await this.instance.post(
        '/v1/bind/bindEthAddress',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
          terminusName,
          jwt: jws,
          did,
          sigFromAddressPrivKey,
          sigFromDomainOwnerPrivKey: eth721_sign,
          signData: JSON.stringify(signData),
          uuid,
          address,
        }),
        { timeout: 1000 * 60 },
      );

      console.log('bindEthAddress result', response);

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      console.log(response.data);

      // await this.gateway.broadcastMessage({
      //   topic: MessageTopic.CANCEL_SIGN,
      //   event: 'bind/address',
      //   message: {
      //     id: id,
      //   },
      // });
      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'settings.cancel.sign',
        }),
        JSON.stringify({
          id: id,
        }),
      );

      const send_result = await postSystemNotification(message);
      console.log('bindEthAddress send result ', send_result);

      return returnSucceed(response.data.data);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/requestTermiPassSignRemoveEthAddress')
  @HttpCode(200)
  async requestTermiPassSignRemoveEthAddress(
    @Req() request: Request,
    @Body()
    {
      sigFromAddressPrivKey,
      signData,
      uuid,
      index,
    }: {
      sigFromAddressPrivKey?: string;
      signData: {
        action: number;
        addr: string;
        algorithm: number;
        domain: string;
        signAt: number;
      };
      uuid: string;
      index: number;
    },
  ): Promise<Result<null>> {
    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }

    const host: string = request.headers['host'];
    console.log('host:' + host);
    const isLocal = host.indexOf('.local.') >= 0;
    console.log('isLocal:' + isLocal);

    if (
      signData.domain !=
      this.secretService.terminusInfo.terminusName.replace('@', '.')
    ) {
      return returnError(500, 'Olares ID is not match');
    }
    try {
      const id = '' + new Date().getTime();
      this.signMessage[id] = {
        id: id,
        sign: {
          callback_url:
            'https://' +
            this.servername +
            '.' +
            (isLocal ? 'local.' : '') +
            this.secretService.terminusInfo.terminusName.replace('@', '.') +
            '/api/cloud/sign/unBindEthAddress',
          sign_body: {
            userid: spaceAccountData.userid,
            terminusName: this.secretService.terminusInfo.terminusName,
          },
          sign_eth: {
            domain: {
              name: 'Terminus DID Root Tagger',
              version: '1',
              chainId: this.chainId,
              verifyingContract: this.verifyingContract,
            },
            types: {
              EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
              ],
              AuthAddressReq: [
                { name: 'addr', type: 'address' },
                { name: 'algorithm', type: 'uint8' },
                { name: 'domain', type: 'string' },
                { name: 'signAt', type: 'uint256' },
                { name: 'action', type: 'uint8' },
              ],
            },
            data: signData,
            primaryType: 'AuthAddressReq',
          },
        },
        vars: {
          terminusName: this.secretService.terminusInfo.terminusName,
          address: signData.addr,
        },
      };

      this.rawMessage[id] = {
        sigFromAddressPrivKey,
        signData,
        uuid,
        address: signData.addr,
        index,
      };

      //payload
      //await this.gateway.broadcastMessage(this.signMessage[id]);
      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'settings.unbind.ethereum',
        }),
        JSON.stringify(this.signMessage[id]),
      );

      this.logger.log(message);

      const send_result = await postSystemNotification(message);
      console.log('removeEthAddress send result ', send_result);

      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/unBindEthAddress')
  @HttpCode(200)
  async unBindEthAddress(
    @Body()
    {
      id,
      did,
      jws,
      terminusName,
      userid,
      eth721_sign,
    }: {
      id: string;
      did: string;
      jws: string;
      terminusName: string;
      userid: string;
      eth721_sign: string;
    },
  ): Promise<Result<null>> {
    try {
      const spaceAccountData = this.accountService.getSpaceAccount();
      if (!spaceAccountData) {
        return returnError(1, 'Terminus Space not loggin');
      }

      if (!(id in this.signMessage)) {
        throw new Error('invalid id');
      }
      delete this.signMessage[id];

      const sigFromAddressPrivKey = this.rawMessage[id].sigFromAddressPrivKey;
      const signData = this.rawMessage[id].signData;
      const uuid = this.rawMessage[id].uuid;
      const address = this.rawMessage[id].address;
      const index = this.rawMessage[id].index;

      const response = await this.instance.post(
        '/v1/bind/unBindEthAddress',
        qs.stringify({
          userid: spaceAccountData.userid,
          token: spaceAccountData.access_token,
          terminusName,
          jwt: jws,
          did,
          sigFromAddressPrivKey,
          sigFromDomainOwnerPrivKey: eth721_sign,
          signData: JSON.stringify(signData),
          uuid,
          address,
          index,
        }),
        { timeout: 1000 * 60 },
      );

      if (response.data.code != 200) {
        throw new Error(response.data.message);
      }

      console.log(response.data);

      // await this.gateway.broadcastMessage({
      //   topic: MessageTopic.CANCEL_SIGN,
      //   event: 'bind/address',
      //   message: {
      //     id: id,
      //   },
      // });
      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'settings.cancel.sign',
        }),
        JSON.stringify({
          id: id,
        }),
      );

      const send_result = await postSystemNotification(message);
      console.log('send result ', send_result);

      return returnSucceed(response.data.data);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/requestTermiPassSignNFT')
  @HttpCode(200)
  async requestTermiPassSignNFT(
    @Req() request: Request,
    @Body()
    {
      token_id,
      token_address,
      token_name,
      nft_name,
      image,
      chain_type,
      owner,
    }: {
      token_id: string;
      token_address: string;
      token_name: string;
      nft_name: string;
      image: string;
      chain_type: string;
      owner: string;
    },
  ): Promise<Result<null>> {
    const host: string = request.headers['host'];
    console.log('host:' + host);
    const isLocal = host.indexOf('.local.') >= 0;
    console.log('isLocal:' + isLocal);

    const spaceAccountData = this.accountService.getSpaceAccount();
    if (!spaceAccountData) {
      return returnError(1, 'Terminus Space not loggin');
    }

    try {
      const data = {
        token_id,
        token_address,
        token_name,
        nft_name,
        image,
        chain_type,
        owner,
        cloud_id: spaceAccountData.userid,
        terminusName: this.secretService.terminusInfo.terminusName,
      };
      const id = '' + new Date().getTime();
      this.signMessage[id] = {
        id: id,
        sign: {
          callback_url:
            'https://' +
            this.servername +
            '.' +
            (isLocal ? 'local.' : '') +
            this.secretService.terminusInfo.terminusName.replace('@', '.') +
            '/api/cloud/sign/bindNFT',
          sign_body: {
            userid: spaceAccountData.userid,
            terminusName: this.secretService.terminusInfo.terminusName,
          },
          sign_vc: {
            type: 'NFT',
            name: nft_name,
            request_path: '/get_nft_info',
            data,
          },
        },
        vars: {
          terminusName: this.secretService.terminusInfo.terminusName,
        },
      };

      //payload
      //await this.gateway.broadcastMessage(this.signMessage[id]);
      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'profile.bind.nft',
        }),
        JSON.stringify(this.signMessage[id]),
      );

      this.logger.log(message);

      const send_result = await postSystemNotification(message);
      console.log('send result ', send_result);

      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/sign/bindNFT')
  @HttpCode(200)
  async bindNFT(
    @Body()
    { id }: { id: string },
  ): Promise<Result<null>> {
    try {
      if (!(id in this.signMessage)) {
        throw new Error('invalid id');
      }
      delete this.signMessage[id];

      // await this.gateway.broadcastMessage({
      //   topic: MessageTopic.CANCEL_SIGN,
      //   event: 'bind/nft',
      //   message: {
      //     id: id,
      //   },
      // });
      const message = createSystemMessage(
        this.secretService.terminusInfo.terminusName.split('@')[0],
        JSON.stringify({
          eventType: 'settings.cancel.sign',
        }),
        JSON.stringify({
          id: id,
        }),
      );

      const send_result = await postSystemNotification(message);
      console.log('send result ', send_result);

      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(500, e.message || 'internal error');
    }
  }
}
