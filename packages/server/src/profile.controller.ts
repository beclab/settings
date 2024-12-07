import { Controller, Logger, Get, Req, Body, Post } from '@nestjs/common';
import {
  returnSucceed,
  returnError,
  Result,
  TerminusInfo,
} from '@bytetrade/core';
import { DataStoreService } from './datastore.service';
import { createInstance } from './bfl/utils';
import axios from 'axios';

export interface Block {
  type: string;
  nickName: string;
  enabled: boolean;
}

export enum SOCIAL_TYPE {
  TWITTER = 'Twitter',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'Tiktok',
  GITHUB = 'Github',
  CLUBHOUSE = 'Clubhouse',
  PATREON = 'Patreon',
  VENMO = 'Venmo',
  CASH_APP = 'CashApp',
  DEEZER = 'Deezer',
  PANDORA = 'Pandora',
  TIDAL = 'Tidal',
  BANDCAMP = 'Bandcamp',
  MEDIUM = 'Medium',
  BEEHIIV = 'Beehiiv',
  FLIPBOARD = 'Flipboard',
  GOODREADS = 'Goodreads',
  MASTODON = 'Mastodon',
  STEAM = 'Steam',
  TUMBLR = 'Tumblr',
}

export interface Social {
  username: string;
  platform: string;
  url: string;
}

export enum HEADER_FORMAT_TYPE {
  COLUMN = 'column',
  ROW = 'row',
}

export enum THEME_TYPE {
  SOLID = 'solid',
  GRADIENT = 'gradient',
  IMAGE = 'image',
}

export enum BLOCK_STYLE_TYPE {
  SQUARE = 'square',
  ROUND = 'round',
  CUSTOM = 'custom',
}

export enum SIZE_TYPE {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGER = 'larger',
}

export enum IMAGE_FILTER {
  NONE = 'none',
  DARK = 'dark',
  Light = 'light',
}

export enum HEADER_STYLE_TYPE {
  CLASSIC = 'classic',
  PORTRAIT = 'portrait',
  BANNER = 'banner',
}

export enum PROFILE_SHAPE_TYPE {
  CIRCULAR = 'circular',
  SQUARE = 'square',
}

export enum BLOCK_TYPE {
  LINK = 'link',
  TEXT = 'text',
  IMAGE = 'image',
}

export enum FONT_TYPE {
  ROBOTO = 'Roboto',
  POPINS = 'Popins',
  ARVO = 'Arvo',
  BITTER = 'Bitter',
  RIGHTEOUS = 'Righteous',
  LOBSTER = 'Lobster',
  ORBITRON = 'Orbitron',
  AUDIOWIDE = 'Audiowide',
  COURGETTE = 'Courgette',
}

export interface User {
  did: string;
  header: {
    style: string;
    banner: string;
    avatarUrl: string;
    profileShape: string;
    profileSize: number;
    profileOutline: boolean;
    nickName: string;
    description: string;
    textSize: string;
    format: string;
  };
  appearance: {
    theme: {
      style: string;
      preset: string;
      uploadImg: string;
      background: string;
      filter: string;
      gradientTopColor: string;
      gradientBottomColor: string;
      useUpload: boolean;
      localImg: string;
      header: {
        textColor: string;
      };
      link: {
        background: string;
        textColor: string;
      };
      block: {
        background: string;
        textColor: string;
      };
    };
    block: {
      cornerRadius: number;
      style: string;
      shadow: boolean;
      outline: boolean;
      transparency: number;
    };
    font: string;
  };
  social: {
    data: Social[];
    size: SIZE_TYPE;
  };
  block: {
    data: Block[];
  };
  layout: {
    style: number;
  };
}

function stringToIntHash(str: string, lowerbound: number, upperbound: number) {
  if (!str) {
    return lowerbound;
  }

  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result + str.charCodeAt(i);
  }

  if (!lowerbound) lowerbound = 0;
  if (!upperbound) upperbound = 500;

  return (result % (upperbound - lowerbound)) + lowerbound;
}

@Controller('/api/profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  private key = 'profile_user_info_v2';

  constructor(
    private readonly dataStoreService: DataStoreService, // private readonly ws: WsStartGateway,
  ) {
    //
  }

  getDefaultSettings(info: TerminusInfo): User {
    let id = 1;
    let nickName = '';

    if (info.terminusName) {
      id = stringToIntHash(info.terminusName, 1, 36);
      if (info.terminusName.includes('@')) {
        const nameList = info.terminusName.split('@');
        nickName = nameList[0];
      }
    }

    return {
      did: '',
      layout: {
        style: 0,
      },
      header: {
        style: HEADER_STYLE_TYPE.CLASSIC,
        banner: '',
        avatarUrl: '' + id + '.png',
        profileShape: PROFILE_SHAPE_TYPE.CIRCULAR,
        profileSize: 100,
        profileOutline: false,
        nickName: nickName,
        description: '',
        textSize: SIZE_TYPE.SMALL,
        format: HEADER_FORMAT_TYPE.COLUMN,
      },
      appearance: {
        theme: {
          style: THEME_TYPE.SOLID,
          uploadImg: '',
          preset: 's0',
          useUpload: false,
          background: '#ffffff',
          filter: IMAGE_FILTER.NONE,
          gradientTopColor: '#8CE3FF',
          gradientBottomColor: '#7FFF93',
          localImg: '',
          header: {
            textColor: '#1F1F1F',
          },
          link: {
            background: '#DCF9EB',
            textColor: '#1F1F1F',
          },
          block: {
            background: '#DCF9EB',
            textColor: '#1F1F1F',
          },
        },
        block: {
          style: BLOCK_STYLE_TYPE.ROUND,
          shadow: false,
          cornerRadius: 8,
          outline: false,
          transparency: 25,
        },
        font: 'Roboto',
      },
      social: {
        data: [],
        size: SIZE_TYPE.SMALL,
      },
      block: {
        data: [],
      },
    };
  }

  async getProfile(info: TerminusInfo): Promise<User> {
    try {
      const data = await this.dataStoreService.GetKey(this.key);

      if (!data) {
        return this.getDefaultSettings(info);
      }

      return data;
    } catch (e) {
      console.log(e);
      return this.getDefaultSettings(info);
    }
  }

  async get_terminus_info(): Promise<TerminusInfo> {
    const response: any = await axios.get(
      'http://bfl/bfl/backend/v1/terminus-info',
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    if (response.data.code != 0) {
      throw new Error(response.data);
    }
    this.logger.log('terminusInfo');
    return response.data.data;
  }

  @Get('/init')
  async init(): Promise<any> {
    try {
      const info: TerminusInfo = await this.get_terminus_info();
      const profile = await this.getProfile(info);

      return returnSucceed({
        info,
        profile,
      });
    } catch (e) {
      console.log(e);
      return {
        code: 1,
        message: 'get info error',
      };
    }
  }

  @Get('/')
  async get_key(): Promise<Result<User>> {
    const info: TerminusInfo = await this.get_terminus_info();
    const data = await this.getProfile(info);

    return returnSucceed(data);
  }

  @Post('/')
  async put_key(@Req() request: Request, @Body() body: any): Promise<any> {
    this.logger.log('put_key ' + this.key);
    this.logger.log(body);

    const data = await this.dataStoreService.GetKey(this.key);
    if (
      data &&
      data.header &&
      data.header.avatarUrl &&
      body &&
      body.header &&
      data.header.avatarUrl != body.header.avatarUrl
    ) {
      this.logger.log('update avatar');
      await createInstance(request).post('/bfl/settings/v1alpha1/set-avatar', {
        avatar: body.header.avatarUrl,
      });
    } else {
      this.logger.log('data');
      this.logger.log(data);
    }
    try {
      const data = await this.dataStoreService.SetKey(this.key, body);

      this.logger.debug(data);
      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(1, e.message || '');
    }
  }
}
