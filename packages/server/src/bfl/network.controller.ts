import { Controller, Logger, Get, Post, Req, Body } from '@nestjs/common';
import { createInstance } from './utils';
import { returnError, returnSucceed } from '@bytetrade/core';
import axios from 'axios';

const FRP_LIST_URL =
  process.env.FRP_LIST_URL || 'https://terminus-frp.snowinning.com';

@Controller('/api')
export class NetworkPolicyController {
  private readonly logger = new Logger(NetworkPolicyController.name);

  @Get('/launcher-acc-policy')
  async list_ips(@Req() request: Request): Promise<any> {
    this.logger.debug('list_ips');
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/launcher-acc-policy',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/launcher-acc-policy')
  async set_ips(@Req() request: Request, @Body() body: any): Promise<any> {
    this.logger.debug('set_ips');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/launcher-acc-policy',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/launcher-public-domain-access-policy')
  async get_headscale_status(@Req() request: Request): Promise<any> {
    this.logger.debug('get_headscale_status');
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/launcher-public-domain-access-policy',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/launcher-public-domain-access-policy')
  async set_headscale_status(
    @Req() request: Request,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('set_headscale_status');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/launcher-public-domain-access-policy',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/ssl/task-state')
  async taskState(@Req() request: Request): Promise<any> {
    this.logger.debug('task-state');
    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/ssl/task-state',
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Post('/ssl/enable')
  async sslEnable(@Req() request: Request, @Body() body: any): Promise<any> {
    this.logger.debug('sslEnable');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/ssl/enable',
      body,
    );
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/reverse-proxy')
  async getReverseProxy(@Req() request: Request): Promise<any> {
    try {
      this.logger.debug('get reverse-proxy');
      const data: any = await createInstance(request).get(
        '/bfl/settings/v1alpha1/reverse-proxy',
      );
      this.logger.debug('get reverse-proxy result');
      this.logger.debug(data.data);
      if (data.status !== 200) {
        throw new Error(data.statusText);
      }
      this.logger.debug(data.data);
      return data.data;
    } catch (e) {
      console.log(e);
      return returnError(1, e.message || '');
    }
  }
  @Post('/reverse-proxy')
  async postReverseProxy(
    @Req() request: Request,
    @Body() body: any,
  ): Promise<any> {
    try {
      this.logger.debug('get reverse-proxy');
      this.logger.debug(body);
      const data: any = await createInstance(request, 15000).post(
        '/bfl/settings/v1alpha1/reverse-proxy',
        body,
      );
      this.logger.debug('set reverse-proxy result');
      //   this.logger.debug(data);
      this.logger.debug(data.data);
      if (data.status !== 200) {
        throw new Error(data.statusText);
      }
      this.logger.debug(data.data);
      return data.data;
    } catch (e) {
      return returnError(1, e.message || '');
    }
  }
  @Get('/frp-servers')
  async getFrpServers() {
    try {
      const olaresTunnels: any = await axios.get(FRP_LIST_URL + '/servers');
      return returnSucceed(olaresTunnels.data);
    } catch (e) {
      return returnError(1, e.message || '');
    }
  }
}
