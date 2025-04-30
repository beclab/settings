import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { returnError, returnSucceed } from '@bytetrade/core';
import axios from 'axios';
import { createOlaresdInstance } from './olaresd/utils';

@Controller('/api')
export class TerminusdController {
  private readonly logger = new Logger(TerminusdController.name);
  //   private baseUrl: string;
  //   private instance: AxiosInstance;

  constructor() {
    console.log('TERMINUSD_HOST:' + process.env.TERMINUSD_HOST);
    // this.baseUrl = `http://${process.env.TERMINUSD_HOST}`;
  }

  @Get('/system/status')
  async systemStatus(@Req() request: Request) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.get('/system/status');
      // console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
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
      const instance = createOlaresdInstance(request);
      const response: any = await instance.post('/command/collect-logs');
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.message);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Get('/system/hosts-file')
  async getHostsFile(@Req() request: Request) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.get('/system/hosts-file');
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Post('/system/hosts-file')
  @HttpCode(200)
  async updateHostsFile(@Req() request: Request, @Body() body: any) {
    try {
      const instance = createOlaresdInstance(request);
      console.log('body:', body);
      const response: any = await instance.post('/system/hosts-file', body);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.message);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Get('/containerd/registries')
  async getContainerMirrors(@Req() request: Request) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.get('/containerd/registries');
      // console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Get('/containerd/registry/mirrors/:registry')
  async getContainerMirrorsByRegistry(
    @Req() request: Request,
    @Param('registry') registry,
  ) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.get(
        `/containerd/registry/mirrors/${registry}`,
      );
      // console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Put('/containerd/registry/mirrors/:registry')
  async putContainerMirrorsByRegistry(
    @Req() request: Request,
    @Param('registry') registry,
    @Body() body: any,
  ) {
    try {
      console.log('body ===>', body);

      const instance = createOlaresdInstance(request);
      const response: any = await instance.put(
        `/containerd/registry/mirrors/${registry}`,
        body,
      );
      console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Get('/containerd/images/:registry')
  async getContainerImages(
    @Req() request: Request,
    @Param('registry') registry,
  ) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.get(`/containerd/images/`, {
        params: {
          registry,
        },
      });
      // console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Delete('/containerd/images/:id')
  async deleteContainerImages(@Req() request: Request, @Param('id') id) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.delete(`/containerd/images/${id}`);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }

  @Delete('/containerd/registry/mirrors/:registry')
  async deleteContainerImagesByRegistry(
    @Req() request: Request,
    @Param('registry') registry,
  ) {
    try {
      const instance = createOlaresdInstance(request);
      const response: any = await instance.delete(
        `/containerd/registry/mirrors/${registry}`,
      );
      console.log('response:', response);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      if (response.data.code !== 200) {
        throw new Error(response.data);
      }
      this.logger.log(response.data);
      return returnSucceed(response.data.data);
    } catch (e) {
      console.log('message:' + e.message);
      return returnError(500, e.message);
    }
  }
}
