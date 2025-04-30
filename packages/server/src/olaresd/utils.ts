import axios, { AxiosInstance } from 'axios';
import { parse } from 'cookie';

export function createOlaresdInstance(
  request: Request,
  timeout = 5000,
): AxiosInstance {
  let token = request.headers['x-authorization'];

  const rawCookie = request.headers['cookie'];

  if (token || rawCookie) {
    if (!token) {
      const cookies = parse(rawCookie);
      token = cookies['auth_token'];
    }

    if (!token) {
      throw Error('token error');
    }
  } else {
    // token =
    const signature: string = request.headers['x-signature'] as string;
    if (!signature) {
      throw Error('token error');
    }
    token = signature;
  }

  const instance = axios.create({
    baseURL: `http://${process.env.TERMINUSD_HOST}`,
    timeout: timeout,
    headers: {
      'X-Signature': token,
    },
  });

  return instance;
}
