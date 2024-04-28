import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  HttpCode,
} from '@nestjs/common';
import { createInstance } from './bfl/utils';
import {
  BackupCreateReq,
  BackupUpdateReq,
  BackupPlanItems,
  BackupPlanItem,
  BackupSnapshots,
  BackupSnapshotDetail,
  returnSucceed,
  Result,
  returnError,
  ProviderRequest,
} from '@bytetrade/core';
import { SecretService } from './secret.service';

@Controller('/api/backup')
export class Backup2Controller {
  private readonly logger = new Logger(Backup2Controller.name);

  constructor(private secretService: SecretService) {
    //
  }

  @Put('/password/:name')
  async setPlanPassword(
    @Req() request: Request,
    @Param('name') name: string,
    @Body() { password }: { password: string },
  ): Promise<Result<null>> {
    this.logger.log('setPlanPassword ' + name);

    const backupPassword = 'settings-backup-' + name;
    try {
      const res: any = await this.secretService.RetrieveSecret(backupPassword);
      console.log(res);
      if (res.code == 0) {
        if (res.data.code == 500) {
          await this.secretService.CreateSecret(backupPassword, password);
          return returnSucceed(null);
        } else {
          await this.secretService.UpdateSecret(backupPassword, password);
          return returnSucceed(null);
        }
      } else {
        return returnError(1, 'Find Password Error');
      }
    } catch (e) {
      console.log(e);
      return returnError(1, '');
    }
  }

  @Post('/password')
  @HttpCode(200)
  async getPlanPassword(
    @Body() data: ProviderRequest<string>,
  ): Promise<Result<string>> {
    this.logger.log('getPlanPassword');
    this.logger.log(data);
    const name = data.data;
    this.logger.log(name);
    try {
      const backupPassword = 'settings-backup-' + name;
      const res: any = await this.secretService.RetrieveSecret(backupPassword);

      return res.data;
    } catch (e) {
      console.log(e);
      return returnError(1, 'Error');
    }
  }

  @Post('/plans')
  async createPlan(
    @Req() request: Request,
    @Body() body: BackupCreateReq,
  ): Promise<any> {
    this.logger.debug('createPlan');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/settings/v1alpha1/backup/plans',
      body,
    );
    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return returnSucceed(data.data);
  }

  @Put('/plans/:name')
  async updatePlan(
    @Req() request: Request,
    @Param('name') name: string,
    @Body() body: BackupUpdateReq,
  ): Promise<Result<BackupPlanItems>> {
    this.logger.debug('updatePlan', name);
    this.logger.debug(body);
    const data: any = await createInstance(request).put(
      '/bfl/settings/v1alpha1/backup/plans/' + name,
      body,
    );

    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return returnSucceed(data.data);
  }

  @Get('/plans')
  async getPlans(@Req() request: Request): Promise<Result<BackupPlanItems>> {
    this.logger.debug('getPlans');

    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/backup/plans/',
    );

    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return returnSucceed(data.data.data);
  }

  @Get('/plans/:name')
  async getPlan(
    @Req() request: Request,
    @Param('name') name: string,
  ): Promise<Result<BackupPlanItem>> {
    this.logger.debug('getPlan', name);

    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/backup/plans/' + name,
    );

    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Delete('/plans/:name')
  async deletePlan(
    @Req() request: Request,
    @Param('name') name: string,
  ): Promise<Result<null>> {
    this.logger.debug('getPlan', name);

    const data: any = await createInstance(request).delete(
      '/bfl/settings/v1alpha1/backup/plans/' + name,
    );

    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:plan_name/snapshots')
  async getSnapshots(
    @Param('plan_name') plan_name: string,
    @Req() request: Request,
  ): Promise<Result<BackupSnapshots>> {
    this.logger.debug('getSnapshots');

    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/backup/plans/' +
        plan_name +
        '/snapshots?limit=-1',
    );

    if (data.data.code !== 0) {
      console.log(data);
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return returnSucceed(data.data.data);
  }

  @Get('/:plan_name/snapshots/:name')
  async getSnapshot(
    @Req() request: Request,
    @Param('plan_name') plan_name: string,
    @Param('name') name: string,
  ): Promise<Result<BackupSnapshotDetail>> {
    this.logger.debug('getSnapshot', name);

    const data: any = await createInstance(request).get(
      '/bfl/settings/v1alpha1/backup/plans/' + plan_name + '/snapshots/' + name,
    );

    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return returnSucceed(data.data);
  }

  @Delete('/:plan_name/snapshots/:name')
  async deleteSnapshot(
    @Req() request: Request,
    @Param('plan_name') plan_name: string,
    @Param('name') name: string,
  ): Promise<any> {
    this.logger.debug('getSnapshot', name);

    const data: any = await createInstance(request).delete(
      '/bfl/settings/v1alpha1/backup/plans/' + plan_name + '/snapshots/' + name,
    );

    if (data.data.code !== 0) {
      throw new Error(data.data.message);
    }
    this.logger.debug(data.data);
    return returnSucceed(data.data);
  }
}
