import axios, { AxiosInstance } from 'axios';
import { parse } from 'cookie';

export function extractToken(request: Request): string {
  let token = request.headers['x-authorization'];
  if (token) return token;

  const rawCookie = request.headers['cookie'];
  if (rawCookie) {
    const cookies = parse(rawCookie);
    //console.log(cookies);
    token = cookies['auth_token'];
    //console.log(token);
  }

  if (!token) {
    throw Error('token error');
  }
  return token;
}

export function createInstance(request: Request): AxiosInstance {
  let token = request.headers['x-authorization'];
  //console.log('x-authorization: ' + token);
  const host = request.headers['host'];
  if (!host) {
    throw Error('host error');
  }

  const rawCookie = request.headers['cookie'];
  //console.log(rawCookie);

  if (token || rawCookie) {
    if (!token) {
      const cookies = parse(rawCookie);
      //console.log(cookies);
      token = cookies['auth_token'];
      //console.log(token);
    }

    if (!token) {
      throw Error('token error');
    }

    return axios.create({
      baseURL: process.env.BFL || 'http://bfl',
      timeout: 5000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'X-Authorization': token,
        'Client-Host': host,
      },
    });
  } else {
    return axios.create({
      baseURL: process.env.BFL || 'http://bfl',
      timeout: 5000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Client-Host': host,
      },
    });
  }
}

export function createAuthInstance(
  request: Request,
  bfl_user: string,
): AxiosInstance {
  let token = request.headers['x-authorization'];
  //console.log('x-authorization: ' + token);
  const host = request.headers['host'];
  if (!host) {
    throw Error('host error');
  }

  const rawCookie = request.headers['cookie'];
  //console.log(rawCookie);
  console.log(request.headers);

  if (token || rawCookie) {
    if (!token) {
      const cookies = parse(rawCookie);
      //console.log(cookies);
      token = cookies['auth_token'];
      //console.log(token);
    }

    if (!token) {
      throw Error('token error');
    }

    return axios.create({
      baseURL: 'http://authelia-backend-svc:9091',
      timeout: 5000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'X-Authorization': token,
        'Client-Host': host,
        'x-bfl-user': bfl_user,
        'X-Forwarded-For': request.headers['x-forwarded-for'] || '',
        'X-Forwarded-Host': request.headers['x-forwarded-host'] || '',
      },
    });
  }

  throw Error('create Instance error');
}
