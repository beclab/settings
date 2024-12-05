import { Controller, Logger, Get, Req, Body, Post } from '@nestjs/common';
import {
  returnSucceed,
  returnError,
  Result,
  TerminusInfo,
} from '@bytetrade/core';
import axios from 'axios';

@Controller('/api')
export class TerminusInfoController {
  private readonly logger = new Logger(TerminusInfoController.name);
  @Get('/terminus-info')
  async terminusInfo(): Promise<Result<TerminusInfo>> {
    const response: any = await axios.get(
      'http://bfl/bfl/backend/v1/terminus-info',
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    if (response.data.code != 0) {
      throw new Error(response.data);
    }
    this.logger.log('terminusInfo');
    return returnSucceed(response.data.data);
  }
}
