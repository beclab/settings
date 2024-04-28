import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataStoreService } from './datastore.service';

export interface Wallpaper {
  desktop: string;
  login: string;
  upload_desktop_backgrounds: string[];
  upload_login_backgrounds: string[];
}

@Injectable()
export class WallpaperService implements OnModuleInit {
  private readonly logger = new Logger(WallpaperService.name);

  wallpaper: Wallpaper;

  key = 'wallpaper';

  constructor(private readonly dataStoreService: DataStoreService) {
    //
  }

  async onModuleInit(): Promise<void> {
    //this.wallpaper = await this.dataStoreService.GetKey(this.key);

    if (!this.wallpaper) {
      this.wallpaper = {
        desktop: '/bg/0.jpg',
        login: '/bg/0.jpg',
        upload_desktop_backgrounds: [],
        upload_login_backgrounds: [],
      };
    }
  }

  async updateWallPaper(): Promise<boolean> {
    this.logger.debug('updateWallPaper');
    this.logger.debug(this.wallpaper);
    return await this.dataStoreService.SetKey(this.key, this.wallpaper);
  }
}
