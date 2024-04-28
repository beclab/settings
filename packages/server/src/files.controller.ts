import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { returnSucceed, Result } from '@bytetrade/core';
import { ProviderClient } from './provider.client';

const client = new ProviderClient('files', 'service.files', 'files', [
  'GetSearchFolderStatus',
  'UpdateSearchFolderPaths',
]);

@Controller('/api/files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor() {
    //
  }

  @Get('/GetSearchFolderStatus')
  async GetSearchFolderStatus() {
    const data = await client.execute('/GetSearchFolderStatus', {});
    this.logger.debug(data);
    return returnSucceed(data.data);
  }

  @Post('/UpdateSearchFolderPaths')
  async UpdateSearchFolderPaths(@Body() { paths }: { paths: string[] }) {
    this.logger.debug('/UpdateSearchFolderPaths');
    this.logger.debug(paths);

    const data = await client.execute('/UpdateSearchFolderPaths', {
      paths,
    });
    this.logger.debug(data);
    return returnSucceed(null);
  }
}
