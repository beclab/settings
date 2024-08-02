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
import { returnSucceed, Result, returnError } from '@bytetrade/core';
import { ProviderClient } from './provider.client';
import axios, { AxiosInstance } from 'axios';

const client = new ProviderClient('files', 'service.files', 'files', [
  'GetSearchFolderStatus',
  'UpdateSearchFolderPaths',
  'GetDatasetFolderStatus',
  'UpdateDatasetFolderPaths',
]);

@Controller('/api/files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);
  private instance: AxiosInstance;
  constructor() {
    //
    this.instance = axios.create({
      baseURL: 'http://media-server-service.os-system:9090',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

  @Get('/video/config')
  async GetVideoConfig() {
    console.log('GetVideoConfg start');

    try {
      const response = await this.instance.get(
        '/System/Configuration/encoding',
      );
      this.logger.debug(response.data);
      return returnSucceed(response.data);
    } catch (e) {
      console.log('System/Configuration/encoding error ==>', e);
      return returnError(500, e.message || 'internal error');
    }
  }

  @Post('/video/config')
  async PostideoConfig(@Body() { data }) {
    console.log('update video config');
    console.log(data);
    try {
      const response = await this.instance.post(
        '/System/Configuration/encoding',
        data,
      );
      console.log('response');
      console.log(response);
      if (response.status == 204) {
        return returnSucceed('');
      }
      return returnError(500, 'internal error');
    } catch (e) {
      console.log('System/Configuration/encoding error ==>', e);
      return returnError(500, e.message || 'internal error');
    }
  }
}
