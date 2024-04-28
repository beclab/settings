import { Module } from '@nestjs/common';
import { SecretController } from './secret.controller';
import { BFLModule } from './bfl/bfl.module';
import { HeadScaleModule } from './headscale/headscale.module';
import { Backup2Controller } from './backup.new.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { WallpaperController } from './wallpaper.controller';
import { WallpaperService } from './wallpaper.service';
import { FilesController } from './files.controller';
import { DeviceController } from './device.controller';
import { CloudController } from './cloud.controller';
import { InitController } from './init.controller';
import { SecretService } from './secret.service';
import { InitService } from './init.service';
import { DeviceService } from './device.service';
import { DataStoreService } from './datastore.service';
import { DataStoreController } from './datastore.controller';
import { AppService } from './app.service';
import { AccountController } from './account.controller';
import { AppController } from './app.controller';
import { EventController } from './event.controller';

@Module({
  imports: [BFLModule, HeadScaleModule, ScheduleModule.forRoot()],
  controllers: [
    AppController,
    SecretController,
    Backup2Controller,
    WallpaperController,
    FilesController,
    DeviceController,
    CloudController,
    InitController,
    DataStoreController,
    AccountController,
    EventController,
  ],
  providers: [
    SecretService,
    DeviceService,
    DataStoreService,
    AppService,
    WallpaperService,
    InitService,
  ],
})
export class AppModule {}
