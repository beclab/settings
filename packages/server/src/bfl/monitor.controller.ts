import { Controller, Logger, Get, Req, Post, Body } from '@nestjs/common';
import axios from 'axios';

// export enum TerminusStatus {
//   UNKNOWN = 0,
//   NORMAL = 1,
//   ERROR = 2,
// }

// export type MonitorState = {
//   usages: Usage[] | undefined;
//   net: Net | undefined;
//   status: TerminusStatus;
// };

@Controller('/api')
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);

  @Get('/monitor/cluster')
  async monitor(@Req() request: Request): Promise<any> {
    //request.cookies['x-authorization'];

    const data: any = await axios.get('http://bfl/bfl/backend/v1/cluster', {});
    if (data.status !== 200) {
      throw new Error(data.statusText);
    }
    this.logger.debug(data.data);
    return data.data;
  }
}
