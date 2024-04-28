import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProviderClient } from './provider.client';
//import { getLookup } from './geo';
const client = new ProviderClient('app', 'service.bfl', 'app', ['UserApps']);

export enum SearchCategory {
  Suggestion = 'Suggestion',
  Command = 'Command',
  Application = 'Application',
  Result = 'Result',
  Use = 'Use',
}

export interface AppInfo {
  id: string;
  appid: string;
  deployment?: string;
  icon: string;
  title: string;
  target: string;
  name: string;
  namespace?: string;
  owner?: string;
  url?: string;
  installed: boolean;
  type?: SearchCategory;
  fatherName: string | null;
}

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    //
  }

  async onModuleInit(): Promise<void> {
    //await getLookup();
  }

  async GetMyApps(): Promise<AppInfo[]> {
    this.logger.log('GetMyApps');
    const response = await client.execute('/UserApps', {});

    this.logger.log(response.data);
    if (response.data.code != 0) {
      throw new Error('GetMyApps error');
    }

    return response.data.data.items;
  }
}
