import {
  Controller,
  Logger,
  Post,
  Body,
  Req,
  Get,
  OnModuleInit,
} from '@nestjs/common';
import { Result, returnError, returnSucceed } from '@bytetrade/core';
import { ProviderClient } from './provider.client';
import { createInstance } from './bfl/utils';
import { Wallpaper, WallpaperService } from './wallpaper.service';

const client = new ProviderClient(
  'desktopConfig',
  'service.desktop',
  'config',
  ['Update'],
);

@Controller('/api/wallpaper')
export class WallpaperController implements OnModuleInit {
  private readonly logger = new Logger(WallpaperController.name);

  constructor(private readonly wallpaperService: WallpaperService) {}

  async onModuleInit(): Promise<void> {
    //
  }

  @Get('/')
  async getWallpaper(): Promise<Result<Wallpaper>> {
    this.logger.debug('getWallpaper');

    return returnSucceed(this.wallpaperService.wallpaper);
  }

  @Post('/upload/desktop')
  async upload_desktop(@Body() { bg }: { bg: string }): Promise<Result<null>> {
    this.logger.debug('upload/desktop');
    this.logger.debug(bg);

    try {
      this.wallpaperService.wallpaper.upload_desktop_backgrounds.push(bg);

      await this.wallpaperService.updateWallPaper();

      return returnSucceed(null);
    } catch (e) {
      return returnError(1, 'upload login bg failed');
    }
  }

  @Post('/delete/desktop')
  async delete_desktop(@Body() { bg }: { bg: string }): Promise<Result<null>> {
    this.logger.debug('delete/desktop');
    this.logger.debug(bg);

    try {
      this.wallpaperService.wallpaper.upload_desktop_backgrounds =
        this.wallpaperService.wallpaper.upload_desktop_backgrounds.filter(
          (item) => item == bg,
        );

      await this.wallpaperService.updateWallPaper();

      return returnSucceed(null);
    } catch (e) {
      return returnError(1, 'delete login bg failed');
    }
  }

  @Post('/desktop')
  async set_background(@Body() { bg }: { bg: string }): Promise<Result<null>> {
    this.logger.debug('set/background');
    this.logger.debug(bg);

    try {
      this.wallpaperService.wallpaper.desktop = bg;
      await this.wallpaperService.updateWallPaper();

      const response = await client.execute('/Update', { bg });

      this.logger.log(response.data);

      return returnSucceed(null);
    } catch (e) {
      console.log(e);
      return returnError(1, 'update background bg failed');
    }
  }

  @Post('/upload/login')
  async upload_login(@Body() { bg }: { bg: string }): Promise<Result<null>> {
    this.logger.debug('upload/login');
    this.logger.debug(bg);

    try {
      this.wallpaperService.wallpaper.upload_login_backgrounds.push(bg);

      await this.wallpaperService.updateWallPaper();

      return returnSucceed(null);
    } catch (e) {
      return returnError(1, 'upload login bg failed');
    }
  }

  @Post('/delete/login')
  async delete_login(@Body() { bg }: { bg: string }): Promise<Result<null>> {
    this.logger.debug('delete/login');
    this.logger.debug(bg);

    try {
      this.wallpaperService.wallpaper.upload_login_backgrounds =
        this.wallpaperService.wallpaper.upload_login_backgrounds.filter(
          (item) => item == bg,
        );

      await this.wallpaperService.updateWallPaper();

      return returnSucceed(null);
    } catch (e) {
      return returnError(1, 'delete login bg failed');
    }
  }

  @Post('/login')
  async set_login(
    @Req() request: Request,
    @Body() { bg }: { bg: string },
  ): Promise<Result<null>> {
    this.logger.debug('set/login');
    this.logger.debug(bg);

    try {
      this.wallpaperService.wallpaper.login = bg;

      await this.wallpaperService.updateWallPaper();

      const response: any = await createInstance(request).post(
        '/bfl/settings/v1alpha1/set-login-background',
        {
          background: bg,
        },
      );

      this.logger.log('update_login');
      this.logger.log(response.data);
      // await this.secretService.updateTerminusInfo();
      return returnSucceed(null);
    } catch (e) {
      return returnError(1, 'update login bg failed');
    }
  }

  @Get('/config/system')
  async get_config(@Req() request: Request): Promise<Result<null>> {
    this.logger.debug('config/system');
    try {
      const response: any = await createInstance(request).get(
        '/bfl/settings/v1alpha1/config-system',
      );
      this.logger.log('config_system');
      this.logger.log(response.data);

      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }

      return returnSucceed(response.data.data);
    } catch (e) {
      console.log(e);
      return returnError(1, 'get config_system failed');
    }
  }
}

/*
httpposturl := fmt.Sprintf("http://%s/legacy/v1alpha1/api.intent/v1/server/intent/send", os.Getenv("OS_SYSTEM_SERVER"))

		fmt.Println("HTTP JSON POST URL:", httpposturl)

		var jsonData = []byte(`{
			"action": "view",
			"category": "video",
			"data": {
				"name": "` + file.Name + `",
				"path": "` + file.Path + `",
				"extention": "` + file.Extension + `"
			}
		}`)
		request, error := http.NewRequest("POST", httpposturl, bytes.NewBuffer(jsonData))
		request.Header.Set("Content-Type", "application/json; charset=UTF-8")

		client := &http.Client{}
		response, error := client.Do(request)
		if error != nil {
			panic(error)
		}
		defer response.Body.Close()

		fmt.Println("response Status:", response.Status)
		fmt.Println("response Headers:", response.Header)
		body, _ := ioutil.ReadAll(response.Body)
		fmt.Println("response Body:", string(body))*/
