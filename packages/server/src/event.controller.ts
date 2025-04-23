import { Controller, Logger, Post, Body } from '@nestjs/common';
import { returnSucceed, Result, ProviderRequest } from '@bytetrade/core';
import { InitService } from './init.service';
import { broadcastWebsocketMessage } from './websocketClient';

export interface Event<T> {
  type: string;
  version: string;
  data: T;
}

@Controller('/api/event')
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private initService: InitService) {
    //
  }

  @Post('/app_installation_event')
  async app_installation_event(
    @Body() event: ProviderRequest<Event<any>>,
  ): Promise<Result<null>> {
    this.logger.debug('app_installation_event');
    this.logger.debug(JSON.stringify(event, null, 2));

    const payload = event.data.data.payload;

    broadcastWebsocketMessage({
      event: 'app_installation_event',
      // data: event.data.data,
      data: payload,
    });

    return returnSucceed(null);
  }

  @Post('/entrance_state_event')
  async entrance_state_event(
    @Body() event: ProviderRequest<Event<any>>,
  ): Promise<Result<null>> {
    this.logger.debug('entrance_state_event');
    this.logger.debug(JSON.stringify(event, null, 2));

    const payload = event.data.data.payload;

    broadcastWebsocketMessage({
      event: 'entrance_state_event',
      // data: event.data.data,
      data: payload,
    });

    return returnSucceed(null);
  }

  @Post('/backup_state_event')
  async backup_state_event(
    @Body() event: ProviderRequest<Event<any>>,
  ): Promise<Result<null>> {
    this.logger.debug('backup_state_event');
    this.logger.debug(JSON.stringify(event, null, 2));

    const payload = event.data.data.payload;

    broadcastWebsocketMessage({
      event: 'backup_state_event',
      // data: event.data.data,
      data: payload,
    });

    return returnSucceed(null);
  }

  @Post('/restore_state_event')
  async restore_state_event(
    @Body() event: ProviderRequest<Event<any>>,
  ): Promise<Result<null>> {
    this.logger.debug('restore_state_event');
    this.logger.debug(JSON.stringify(event, null, 2));

    const payload = event.data.data.payload;

    broadcastWebsocketMessage({
      event: 'restore_state_event',
      // data: event.data.data,
      data: payload,
    });

    return returnSucceed(null);
  }

  @Post('/system_upgrade_event')
  async system_upgrade_event(
    @Body() event: ProviderRequest<Event<any>>,
  ): Promise<Result<null>> {
    this.logger.debug('system_upgrade_event');
    this.logger.debug(JSON.stringify(event, null, 2));

    // const updated = await this.initService.updateLocalVersion();
    // this.logger.log('updated', updated);
    // if (!updated) {
    //   await this.initService.getOSVersion(true);
    //   await this.initService.getOSVersion(false);
    // }
    // broadcastWebsocketMessage({
    //   event: 'system_upgrade_event',
    //   data: event.data.data,
    // });

    return returnSucceed(null);
  }
}
