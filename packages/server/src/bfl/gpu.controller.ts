import { Controller, Logger, Get, Post, Req, Body } from '@nestjs/common';
import { createInstance } from './utils';
import { returnError } from '@bytetrade/core';

@Controller('/api/gpu')
export class GPUController {
  private readonly logger = new Logger(GPUController.name);

  @Get('/managed-memory')
  async getManagedMemory(@Req() request: Request): Promise<any> {
    try {
      this.logger.debug('get managed-memory');
      const data: any = await createInstance(request, 10000).get(
        '/bfl/settings/v1alpha1/gpu/managed-memory',
      );
      this.logger.debug('get managed-memory result');
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
  @Post('/managed-memory')
  async postManagedMemory(
    @Req() request: Request,
    @Body() { managedMemory }: { managedMemory: boolean },
  ): Promise<any> {
    try {
      this.logger.debug('post managed-memory');
      this.logger.debug(managedMemory);
      const axios = createInstance(request);
      const headers = axios.defaults.headers;
      console.log('headers ====>', headers);

      const data: any = await createInstance(request, 10000).post(
        `/bfl/settings/v1alpha1/gpu/${
          managedMemory ? 'enable' : 'disable'
        }/managed-memory`,
        undefined,
        {
          headers: {
            ...(headers as any),
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.debug('set managed-memory result');
      this.logger.debug(data.data);
      if (data.status !== 200) {
        throw new Error(data.statusText);
      }
      this.logger.debug(data.data);
      return data.data;
    } catch (e) {
      this.logger.debug('set managed-memory result error ===>', e);
      return returnError(1, e.message || '');
    }
  }
}
