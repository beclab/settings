import {
  Controller,
  Logger,
  Get,
  Post,
  Req,
  Param,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { createInstance } from './utils';

@Controller('/api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  @Post('/')
  async create_user(@Req() request: Request, @Body() body: any): Promise<any> {
    this.logger.debug('create_user');
    this.logger.debug(body);
    const data: any = await createInstance(request).post(
      '/bfl/iam/v1alpha1/users',
      body,
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/')
  async list_users(@Req() request: Request): Promise<any> {
    this.logger.debug('list_users');
    const data: any = await createInstance(request).get(
      '/bfl/iam/v1alpha1/users',
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:username')
  async get_user_info(
    @Req() request: Request,
    @Param('username') username,
  ): Promise<any> {
    this.logger.debug('get_user_info ' + username);
    const data: any = await createInstance(request).get(
      '/bfl/iam/v1alpha1/users/' + username,
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Delete('/:username')
  async delete_user(
    @Req() request: Request,
    @Param('username') username,
  ): Promise<any> {
    this.logger.debug('delete_user ' + username);
    const data: any = await createInstance(request).delete(
      '/bfl/iam/v1alpha1/users/' + username,
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Put('/:username/password')
  async reset_password(
    @Req() request: Request,
    @Param('username') username,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('reset_password ' + username);
    this.logger.debug(body);
    const data: any = await createInstance(request).put(
      '/bfl/iam/v1alpha1/users/' + username + '/password',
      body,
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:username/status')
  async account_status(
    @Req() request: Request,
    @Param('username') username,
  ): Promise<any> {
    this.logger.debug('account_status ' + username);
    const data: any = await createInstance(request).get(
      '/bfl/iam/v1alpha1/users/' + username + '/status',
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Put('/:username/limits')
  async account_limits(
    @Req() request: Request,
    @Param('username') username,
    @Body() body: any,
  ): Promise<any> {
    this.logger.debug('account_limits ' + username);
    this.logger.debug(body);
    const data: any = await createInstance(request).put(
      '/bfl/iam/v1alpha1/users/' + username + '/limits',
      body,
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:username/metrics')
  async account_metrics(
    @Req() request: Request,
    @Param('username') username,
  ): Promise<any> {
    this.logger.debug('account_metrics ' + username);
    const data: any = await createInstance(request).get(
      '/bfl/iam/v1alpha1/users/' + username + '/metrics',
    );

    this.logger.debug(data.data);
    return data.data;
  }

  @Get('/:username/login-records')
  async loginRecords(
    @Req() request: Request,
    @Param('username') username,
  ): Promise<any> {
    this.logger.debug('login records ' + username);
    const data: any = await createInstance(request).get(
      '/bfl/iam/v1alpha1/users/' + username + '/login-records',
    );

    this.logger.debug(data.data);
    return data.data;
  }
}
