import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ProviderClient } from './provider.client';
import axios from 'axios';
import { SpaceSaveData, Secret, TerminusInfo } from '@bytetrade/core';
import { Cloud_URL } from './utils';
import * as qs from 'qs';

//const isTest = process.env.IS_TEST || false;
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

  //public secrets: Secret[] = [];
  public spaceAccount: SpaceSaveData;

  private cloudUrl = process.env.APP_SERVICE_CLOUD_URL || Cloud_URL;

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

    const secrets: Secret[] = await this.ListSecret();
    for (const secret of secrets) {
      if (secret.name == 'settings-account-space') {
        this.spaceAccount = JSON.parse(secret.value);
        console.log(secret.value);
        this.logger.log(this.spaceAccount);
      }
    }
  }

  async CreateSecret(name: string, value: string): Promise<void> {
    const data = await client.execute(
      '/CreateSecret?workspace=' + (isTest ? TestWorkspace : 'settings'),
      { name, value },
    );

    if (name == 'settings-account-space') {
      this.spaceAccount = JSON.parse(value);

      //   this.registerSpace();
    }

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

    if (name == 'settings-account-space') {
      this.spaceAccount = JSON.parse(value);
    }

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

  //@Cron('0 * * * * *')
  @Interval(1000 * 3600)
  async refreshToken() {
    this.logger.log('refresh Token');
    const secrets: Secret[] = await this.ListSecret();
    for (const secret of secrets) {
      if (secret.name == 'settings-account-space') {
        this.spaceAccount = JSON.parse(secret.value);
        const now = new Date().getTime();
        if (now > this.spaceAccount.expired) {
          this.logger.log('should delete');
          await this.DeleteSecret(secret.name);
        } else if (now > this.spaceAccount.expired - 60 * 60 * 1000 * 20) {
          this.logger.log('should refresh');
          try {
            const instance = axios.create({
              baseURL: this.cloudUrl,
              timeout: 1000 * 10,
              headers: {},
            });

            const response = await instance.post(
              '/v2/user/refresh',
              qs.stringify({
                userid: this.spaceAccount.userid,
                token: this.spaceAccount.token,
              }),
            );
            console.log(response.data);
            if (response.data.code == 200) {
              console.log(response.data.data);
              this.spaceAccount.expired = Number(response.data.data);
              await this.UpdateSecret(
                secret.name,
                JSON.stringify(this.spaceAccount),
              );
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          this.logger.log('do nothing');
        }
      } else {
        continue;
      }
    }
  }

  @Interval(1000 * 120)
  async refreshMonitor() {
    this.logger.log('refresh Monitor');
    const secrets: Secret[] = await this.ListSecret();
    for (const secret of secrets) {
      if (secret.name == 'settings-account-space') {
        //const spaceAccount = JSON.parse(secret.value);

        try {
          const cluster: any = await axios.get(
            'http://bfl/bfl/backend/v1/cluster',
            {},
          );
          if (cluster.status !== 200) {
            throw new Error(cluster.statusText);
          }
          this.logger.debug(cluster.data);

          const instance = axios.create({
            baseURL: this.cloudUrl,
            timeout: 1000 * 10,
            headers: {},
          });

          const response = await instance.post(
            '/v1/resource/clusterMetrics/update',
            qs.stringify({
              userid: this.spaceAccount.userid,
              token: this.spaceAccount.token,
              terminusName: this.terminusInfo.terminusName,
              content: JSON.stringify(cluster.data.data),
            }),
          );
          console.log(response.data);
          if (response.data.code == 200) {
            console.log(response.data.data);
            // this.spaceAccount.expired = Number(response.data.data);
            // await this.UpdateSecret(
            //   secret.name,
            //   JSON.stringify(this.spaceAccount),
            // );
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        this.logger.log('do nothing');
      }
    }
  }
}
