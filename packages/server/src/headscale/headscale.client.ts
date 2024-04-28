import axios from 'axios';
import * as bcrypt from 'bcrypt';

const bflUrl = process.env.BFL || 'http://bfl';

const providerUrl = 'http://' + process.env.OS_SYSTEM_SERVER;
const OS_APP_KEY = process.env.OS_APP_KEY;
const OS_APP_SECRET = process.env.OS_APP_SECRET;
const IS_DEBUG = process.env.IS_DEBUG || false;

console.log('providerUrl ' + providerUrl);
console.log('OS_APP_KEY' + OS_APP_KEY);
console.log('OS_APP_SECRET' + OS_APP_SECRET);

export class HeadScaleClient {
  group = 'service.headscale';

  dataType = 'headscale';

  ops = [
    'GetMachine',
    'DeleteMachine',
    'GetRoute',
    'SetTags',
    'EnableRoute',
    'DisableRoute',
    'RenameMachine',
  ];

  token = null;

  expire_at = null;

  async getAccessToken() {
    const instance = axios.create({
      baseURL: providerUrl,
      timeout: 10000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      },
    });

    const timestamp = (new Date().getTime() / 1000).toFixed(0);
    const text = OS_APP_KEY! + timestamp + OS_APP_SECRET;
    const token = await bcrypt.hash(text, 10);

    const response = await instance.post('/permission/v1alpha1/access', {
      app_key: OS_APP_KEY,
      timestamp: Number(timestamp),
      token: token,
      perm: {
        group: this.group,
        dataType: this.dataType,
        version: 'v1',
        ops: this.ops,
      },
    });

    if (IS_DEBUG) {
      console.log(response);
    }

    if (!response || response.status != 200 || !response.data) {
      throw Error('Network error, error 10001');
    }

    const data = response.data;
    if (IS_DEBUG) {
      console.log(data.data);
    }
    if (data.code === 0) {
      this.token = null;
      this.expire_at = null;
      this.token = data.data.access_token;
      this.expire_at = new Date(data.data.expired_at).getTime();
    } else {
      throw Error('Network error, error 10002');
    }
  }

  isTokenValid(): boolean {
    if (!this.token || !this.expire_at) {
      return false;
    }

    const now = new Date().getTime();
    console.log('isTokenValid ', now, this.expire_at);
    if (now >= this.expire_at || this.expire_at - now < 60 * 2 * 1000) {
      console.log('isTokenValid false');
      return false;
    }

    return true;
  }

  async execute(path: string, data: any) {
    if (!this.isTokenValid()) {
      await this.getAccessToken();
    }
    const instance = axios.create({
      baseURL: providerUrl,
      timeout: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'X-Access-Token': this.token,
      },
    });

    const url =
      '/system-server/v1alpha1/' + this.dataType + '/' + this.group + path;

    const response = await instance.post(url, data);

    if (!response) {
      throw Error('Network error, error 10003');
    }
    console.log(response.data);
    if (response.status == 404) {
      return {
        count: 0,
        offset: data.offset ? data.offset : 0,
        limit: data.limit ? data.limit : 0,
        items: [],
      };
    }

    if (response.status != 200 || !response.data) {
      throw Error('Network error, error 10004');
    }

    if (response.data.code != 0) {
      console.log('error');
      console.log(response.data);
      throw Error('Network error, error');
    }

    const res = response.data.data;
    console.log('query result');
    console.log(res);
    if (res.code === 0) {
      return res.data;
    }
    throw Error('Network error, res.code ' + res.code);
  }
}
