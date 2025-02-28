import axios from 'axios';
import * as qs from 'qs';
import { AccountType } from '@bytetrade/core';
export const Cloud_URL = 'https://cloud-api.bttcdn.com';

export class DomainCookieRecord {
  domain = '';
  name = '';
  value = '';
  expires: number | string | Date = 0;
  path = '/';
  secure = '';
  httpOnly = false;
  sameSite = '';
  other = '';

  constructor(props?: Partial<DomainCookieRecord>) {
    props && Object.assign(this, props);
  }
}

export class DomainCookie {
  domain = '';
  account = '';
  records: DomainCookieRecord[] = [];

  get_store_key() {
    if (this.account) {
      return 'cookie:' + this.domain + ':' + this.account;
    } else {
      return 'cookie:' + this.domain;
    }
  }

  constructor(props?: Partial<DomainCookie>) {
    props && Object.assign(this, props);
  }
}

export interface GoogleRefreshResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface DropboxRefreshResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface SpaceRefreshResponse {
  token: string;
  expired: number;
}

export class IntegrationAccountData {
  refresh_token: string;
  access_token: string;
  expires_in: number;
  expires_at: number;
  create_at: number;
  available?: boolean;

  constructor(props?: Partial<IntegrationAccountData>) {
    props && Object.assign(this, props);
  }
}

export class GoogleAccountData extends IntegrationAccountData {
  scope: string;
  id_token: string;
  client_id: string;

  constructor(props?: Partial<GoogleAccountData>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class SpaceAccountData extends IntegrationAccountData {
  userid: string;

  constructor(props?: Partial<SpaceAccountData>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class DropboxAccountData extends IntegrationAccountData {
  constructor(props?: Partial<DropboxAccountData>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class AWSS3boxAccountData extends IntegrationAccountData {
  endpoint: string;
  bucket: string;
  constructor(props?: Partial<DropboxAccountData>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class IntegrationAccountMiniData {
  name: string;
  type: AccountType;
  expires_at: number;
  available: boolean;
  create_at: number;

  data? = '';

  constructor(props?: Partial<IntegrationAccountMiniData>) {
    props && Object.assign(this, props);
  }
}

export abstract class IntegrationAccount {
  name: string;
  type: AccountType;
  raw_data: IntegrationAccountData;

  public get_store_key() {
    if (this.name) {
      return 'integration-account:' + this.type + ':' + this.name;
    } else {
      return 'integration-account:' + this.type;
    }
  }

  public get_mini_data(): IntegrationAccountMiniData {
    return {
      name: this.name,
      type: this.type,
      expires_at: this.raw_data.expires_at,
      available: this.raw_data.available,
      create_at: this.raw_data.create_at,
    };
  }

  abstract refresh();

  constructor(props?: Partial<IntegrationAccount>) {
    props && Object.assign(this, props);
  }
}

export class GoogleAccount extends IntegrationAccount {
  type = AccountType.Google;
  //   client_id =
  //     '343424174381-vrtlie7g85jcso7c98c4vavo17qoied7.apps.googleusercontent.com';
  scoped = '';

  async refresh() {
    const data: GoogleAccountData = this.raw_data as GoogleAccountData;
    let response: any;
    if (
      data.client_id ==
      '343424174381-vrtlie7g85jcso7c98c4vavo17qoied7.apps.googleusercontent.com'
    ) {
      response = await axios.post(
        'https://oauth2.googleapis.com/token',
        qs.stringify({
          grant_type: 'refresh_token',
          client_id: data.client_id,
          refresh_token: data.refresh_token,
        }),
        {
          timeout: 1000 * 10,
        },
      );
    } else {
      response = await axios.post(
        olaresSpaceUrl + '/v1/common/google/token/refresh',
        {
          refreshToken: data.refresh_token,
        },
        {
          timeout: 1000 * 10,
        },
      );
      response = response.data;
    }
    console.log(response);

    const res = response.data;
    data.access_token = res.access_token || res.accessToken;
    data.expires_in = res.expires_in || res.expiresIn;
    data.expires_at =
      Date.now() + (res.expires_in || res.expiresIn || 0) * 1000;

    this.raw_data = data;
  }

  constructor(props?: Partial<GoogleAccount>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class DropboxAccount extends IntegrationAccount {
  type = AccountType.Dropbox;
  client_id = '1wsiv9u728vqzat';

  async refresh() {
    const data: DropboxAccountData = this.raw_data as DropboxAccountData;
    const response: any = await axios.post(
      'https://api.dropboxapi.com/oauth2/token',
      qs.stringify({
        grant_type: 'refresh_token',
        client_id: this.client_id,
        refresh_token: data.refresh_token,
      }),
      {
        timeout: 10 * 1000,
      },
    );
    console.log(response);

    const res = response.data as DropboxRefreshResponse;

    data.access_token = res.access_token;
    data.expires_in = res.expires_in;
    data.expires_at = Date.now() + res.expires_in * 1000;

    this.raw_data = data;
  }

  constructor(props?: Partial<DropboxAccount>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class SpaceAccount extends IntegrationAccount {
  type = AccountType.Space;

  private cloudUrl = olaresSpaceUrl;

  async refresh() {
    const data = this.raw_data as SpaceAccountData;

    try {
      const instance = axios.create({
        baseURL: this.cloudUrl,
        timeout: 1000 * 10,
        headers: {},
      });
      const response = await instance.post(
        '/v2/user/refresh',
        qs.stringify({
          userid: data.userid,
          token: data.refresh_token,
        }),
      );

      if (!response || !response.data || response.data.code != 200) {
        return;
      }

      const res = response.data.data as SpaceRefreshResponse;

      data.access_token = res.token;
      data.refresh_token = res.token;
      data.expires_in = (res.expired - new Date().getTime()) / 1000;
      data.expires_at = res.expired;
      this.raw_data = data;
    } catch (e) {
      console.log(e);
    }
  }

  async refreshMonitor() {
    const data = this.raw_data as SpaceAccountData;
    try {
      const cluster: any = await axios.get(
        'http://bfl/bfl/backend/v1/cluster',
        {},
      );
      if (cluster.status !== 200) {
        throw new Error(cluster.statusText);
      }

      const instance = axios.create({
        baseURL: this.cloudUrl,
        timeout: 1000 * 10,
        headers: {},
      });

      const response = await instance.post(
        '/v1/resource/clusterMetrics/update',
        qs.stringify({
          userid: data.userid,
          token: data.access_token,
          terminusName: this.name,
          content: JSON.stringify(cluster.data.data),
        }),
      );
      console.log(response.data);
      if (response.data.code == 200) {
        console.log(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  constructor(props?: Partial<SpaceAccount>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class OneDriveRefresh {}

export class AWSS3Account extends IntegrationAccount {
  type = AccountType.AWSS3;
  async refresh() {
    // throw new Error('Method not implemented.');
    return;
  }
  constructor(props?: Partial<AWSS3Account>) {
    super(props);
    props && Object.assign(this, props);
  }
}

export class TencentAccount extends IntegrationAccount {
  type = AccountType.Tencent;
  async refresh() {
    // throw new Error('Method not implemented.');
    return;
  }
  constructor(props?: Partial<TencentAccount>) {
    super(props);
    props && Object.assign(this, props);
  }
}

// const formatOlaresDefaultUrl =

export const formatDefaultHost = (host: string) => {
  if (!host.endsWith('/')) {
    return host;
  }
  return host.substring(0, host.length - 1);
};

export const olaresSpaceUrl = formatDefaultHost(
  process.env.OLARES_SPACE_URL || 'https://cloud-api.bttcdn.com',
);
