import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProviderClient } from './provider.client';
import axios from 'axios';
import { Secret, TerminusInfo } from '@bytetrade/core';
import { DomainCookie } from './utils';

const isTest = false;
const TestWorkspace = process.env.TestWorkspace || 'settings-dev';
const client = new ProviderClient('secret', 'secret.infisical', 'secret', [
  'RetrieveSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
  'CreateSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
  'DeleteSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
  'UpdateSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
  'ListSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
]);

@Injectable()
export class SecretService implements OnModuleInit {
  private readonly logger = new Logger(SecretService.name);

  public terminusInfo: TerminusInfo | null = null;
  public userInfo = null;

  cookies: DomainCookie[] = [];

  constructor() {
    //
  }

  public async updateTerminusInfo(): Promise<TerminusInfo> {
    const response: any = await axios.get(
      'http://bfl/bfl/backend/v1/terminus-info',
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    if (response.data.code != 0) {
      throw new Error(response.data);
    }
    this.terminusInfo = response.data.data;
    this.logger.log('terminusInfo');
    this.logger.log(this.terminusInfo);
    return response.data.data;
  }

  public async updateUserInfo() {
    const response = await axios.get('http://bfl/bfl/backend/v1/user-info');
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    if (response.data.code != 0) {
      throw new Error(response.data);
    }
    this.userInfo = response.data.data;
    return response.data.data;
  }

  async onModuleInit(): Promise<void> {
    await this.updateTerminusInfo();
    await this.updateUserInfo();
  }

  async CreateSecret(name: string, value: string): Promise<void> {
    const data = await client.execute(
      '/CreateSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
      { name, value },
    );

    this.logger.debug(data);
  }

  async RetrieveSecret(name: string): Promise<Secret> {
    const data = await client.execute(
      '/RetrieveSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
      { name },
    );
    this.logger.debug(data);
    return data;
  }

  async DeleteSecret(name: string): Promise<void> {
    const data = await client.execute(
      '/DeleteSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
      { name },
    );
    this.logger.debug(data);
  }

  async UpdateSecret(name: string, value: string): Promise<void> {
    const data = await client.execute(
      '/UpdateSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
      { name, value },
    );

    this.logger.debug(data);
  }

  async ListSecret(): Promise<Secret[]> {
    const response = await client.execute(
      '/ListSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
      {},
    );

    if (
      response.code == 0 &&
      response.data.code == 500 &&
      response.data.message ==
        'get user workspace error, not found the workspaces of user org'
    ) {
      return [];
    }

    console.log('list secert');
    this.logger.debug(response.data);
    if (!response.data.data) {
      return [];
    }

    return response.data.data;
  }

  async updateCookie(c: DomainCookie, need_update: boolean) {
    const found = this.cookies.find(
      (a) => a.get_store_key() == c.get_store_key(),
    );
    if (found) {
      this.cookies = this.cookies.map((a) => {
        if (a.get_store_key() == c.get_store_key()) {
          return c;
        }
        return a;
      });
      if (need_update) {
        await this.UpdateSecret(c.get_store_key(), JSON.stringify(c));
      }
    } else {
      this.cookies.push(c);
      if (need_update) {
        await this.CreateSecret(c.get_store_key(), JSON.stringify(c));
      }
    }
  }
}
