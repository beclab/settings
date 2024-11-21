import { Controller, Get, HttpCode, Logger, Post, Req } from '@nestjs/common';
import { returnError, returnSucceed } from '@bytetrade/core';
import axios from 'axios';

@Controller('/api')
export class TerminusdController {
  private readonly logger = new Logger(TerminusdController.name);
  private baseUrl: string;

  constructor() {
    console.log('TERMINUSD_HOST:' + process.env.TERMINUSD_HOST);
    this.baseUrl = `http://${process.env.TERMINUSD_HOST}`;
  }

  @Get('/system/status')
  async systemStatus(@Req() request: Request) {
    try {
      const signature: string = request.headers['x-signature'] as string;
      console.log('signature:' + signature);
      const response: any = await axios.get(`${this.baseUrl}/system/status`, {
        headers: { 'X-Signature': signature },
      });
      // console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code != 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Post('/command/collectLogs')
  @HttpCode(200)
  async collectLogs(@Req() request: Request) {
    try {
      const signature: string = request.headers['x-signature'] as string;
      console.log('signature:' + signature);
      const response: any = await axios.post(
        `${this.baseUrl}/command/collect-logs`,
        null,
        { headers: { 'X-Signature': signature } },
      );
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code != 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.message);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }
}
