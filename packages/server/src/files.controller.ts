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
  'GetDatasetFolderStatus',
  'UpdateDatasetFolderPaths',
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

  @Get('/GetDatasetFolderStatus')
  async GetDatasetFolderStatus(
    @Body()
    {
      datasetIDs,
      datasetNames,
    }: {
      datasetIDs?: string[];
      datasetNames?: string[];
    },
  ) {
    const data = await client.execute('/GetDatasetFolderStatus', {
      datasetIDs,
      datasetNames,
    });
    this.logger.log('data ===>');
    this.logger.log(data);
    return returnSucceed(data.data);
  }

  @Post('/UpdateDatasetFolderPaths')
  async UpdateDatasetFolderPaths(
    @Body()
    {
      datasetID,
      datasetName,
      paths,
      create_or_delete,
    }: {
      datasetID?: string;
      datasetName?: string;
      paths?: string[];
      create_or_delete?: number;
    },
  ) {
    this.logger.debug('/UpdateDatasetFolderPaths');
    this.logger.debug(paths);

    const data = await client.execute('/UpdateDatasetFolderPaths', {
      paths,
      dataset_id: datasetID,
      dataset_name: datasetName,
      create_or_delete,
    });
    this.logger.debug(data);
    return returnSucceed(null);
  }
}
