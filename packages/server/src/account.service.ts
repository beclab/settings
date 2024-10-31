import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval, Cron } from '@nestjs/schedule';
import { Secret } from '@bytetrade/core';
import { SecretService } from './secret.service';
import {
  AWSS3Account,
  AccountType,
  DropboxAccount,
  GoogleAccount,
  IntegrationAccount,
  IntegrationAccountData,
  IntegrationAccountMiniData,
  SpaceAccount,
  SpaceAccountData,
  TencentAccount,
} from './utils';

@Injectable()
export class AccountService implements OnModuleInit {
  private readonly logger = new Logger(AccountService.name);

  accounts: IntegrationAccount[] = [];

  constructor(private secretService: SecretService) {
    //
  }

  getInstanceByData(name: string, type: string, value: IntegrationAccountData) {
    if (type == AccountType.Dropbox) {
      return new DropboxAccount({
        name,
        type: AccountType.Dropbox,
        raw_data: value,
      });
    } else if (type == AccountType.Google) {
      return new GoogleAccount({
        name,
        type: AccountType.Google,
        raw_data: value,
      });
    } else if (type == AccountType.Space) {
      return new SpaceAccount({
        name,
        type: AccountType.Space,
        raw_data: value,
      });
    } else if (type == AccountType.AWSS3) {
      return new AWSS3Account({
        name,
        type: AccountType.AWSS3,
        raw_data: value,
      });
    } else if (type == AccountType.Tencent) {
      return new TencentAccount({
        name,
        type: AccountType.Tencent,
        raw_data: value,
      });
    } else {
      throw new Error('not support');
    }
  }

  getSpaceAccount(): SpaceAccountData | undefined {
    console.log('getSpaceAccount this.accounts');
    console.log(this.accounts);

    const result = this.accounts.find((a) => a.type == AccountType.Space)
      ?.raw_data as SpaceAccountData;
    console.log('result ===>');
    console.log(result);

    return result;
  }

  getIntegrationAccountFullInfoByKey(
    key: string,
  ): IntegrationAccount | undefined {
    console.log(key);
    console.log(this.accounts);
    return this.accounts.find((a) => a.get_store_key() == key);
  }

  getIntegrationAccountByAccountType(
    type: AccountType,
    name?: string,
  ): IntegrationAccountMiniData[] {
    return this.accounts
      .filter((a) => a.type == type && (name ? a.name == name : true))
      .map((a) => a.get_mini_data());
  }

  getAllIntegrationAccount(): IntegrationAccountMiniData[] {
    return this.accounts.map((a) => a.get_mini_data());
  }

  async removeIntegrationAccount(key: string) {
    this.accounts = this.accounts.filter((a) => a.get_store_key() != key);
    await this.secretService.DeleteSecret(key);
  }

  async updateIntegrationAccount(account: IntegrationAccount) {
    const found = this.accounts.find(
      (a) => a.name == account.name && a.type == account.type,
    );
    if (found) {
      this.accounts = this.accounts.map((a) => {
        if (a.name == account.name && a.type == account.type) {
          return account;
        }
        return a;
      });
      await this.secretService.UpdateSecret(
        account.get_store_key(),
        JSON.stringify(account.raw_data),
      );
    } else {
      this.accounts.push(account);
      await this.secretService.CreateSecret(
        account.get_store_key(),
        JSON.stringify(account.raw_data),
      );
    }
  }

  async onModuleInit(): Promise<void> {
    const secrets: Secret[] = await this.secretService.ListSecret();
    for (const secret of secrets) {
      if (!secret.name.startsWith('integration-account:')) {
        continue;
      }

      const arr = secret.name.split(':');
      const name = arr.length == 3 ? arr[2] : '';

      this.accounts.push(
        this.getInstanceByData(name, arr[1], JSON.parse(secret.value)),
      );
    }
    console.log('this.accounts ===>');
    console.log(this.accounts);
  }

  @Cron('0 */10 * * * *')
  async refreshToken() {
    this.logger.log('refresh Token');

    const now = new Date().getTime();
    // const removed = [];
    for (let i = 0; i < this.accounts.length; i++) {
      if (!this.accounts[i].raw_data.available) {
        continue;
      }
      if (this.accounts[i].raw_data.expires_at <= 0) {
        continue;
      }
      const compare =
        now < this.accounts[i].raw_data.expires_at - 60 * 60 * 1000;
      if (compare) {
        continue;
      }

      try {
        await this.accounts[i].refresh();

        await this.secretService.UpdateSecret(
          this.accounts[i].get_store_key(),
          JSON.stringify(this.accounts[i].raw_data),
        );
      } catch (e) {
        if (now > this.accounts[i].raw_data.expires_at) {
          this.accounts[i].raw_data.available = false;
          await this.secretService.UpdateSecret(
            this.accounts[i].get_store_key(),
            JSON.stringify(this.accounts[i].raw_data),
          );
        }
      }
    }

    // for (const key of removed) {
    //   //   this.accounts = this.accounts.filter((a) => a.get_store_key() != key);
    //   await this.secretService.DeleteSecret(key);
    // }
  }

  @Interval(1000 * 60 * 2)
  async refreshMonitor() {
    this.logger.log('refresh Monitor');

    for (const account of this.accounts) {
      if (account.type != AccountType.Space) {
        continue;
      }

      await (account as SpaceAccount).refreshMonitor();
      break;
    }
  }
}
