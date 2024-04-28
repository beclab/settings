import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TermiPassDeviceInfo } from '@bytetrade/core';
import { DataStoreService } from './datastore.service';

@Injectable()
export class DeviceService implements OnModuleInit {
  private readonly logger = new Logger(DeviceService.name);

  private key = 'termipass_devices2';
  public termiPasses: TermiPassDeviceInfo[] = [];

  constructor(private readonly dataStoreService: DataStoreService) {
    //
  }

  async onModuleInit(): Promise<void> {
    const data = await this.dataStoreService.GetKey(this.key);

    if (data) {
      this.termiPasses = data.devices;
    } else {
      this.termiPasses = [];
    }
  }

  public async saveTermiPasses(): Promise<void> {
    try {
      this.dataStoreService.SetKey(this.key, { devices: this.termiPasses });
    } catch (e) {
      console.log(e);
    }
  }

  public async getMergedDevice(): Promise<TermiPassDeviceInfo[]> {
    const group: TermiPassDeviceInfo[][] = [];
    for (const device of this.termiPasses) {
      const l = group.find(
        (g) =>
          g[0].platform == device.platform &&
          g[0].manufacturer == device.manufacturer &&
          g[0].description == device.description &&
          g[0].client_type == device.client_type,
      );
      if (!l) {
        group.push([device]);
      } else {
        l.push(device);
      }
    }

    const d: TermiPassDeviceInfo[] = [];
    for (const g of group) {
      d.push(g.sort((a, b) => (a.lastSeenTime < b.lastSeenTime ? 1 : -1))[0]);
    }

    return d;
  }
}
