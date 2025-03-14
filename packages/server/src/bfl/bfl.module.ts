import { Module } from '@nestjs/common';
import { UpgradeController } from './upgrade.controller';
import { BackendController } from './backend.controller';
//import { BackupController } from './backup.controller';
import { RolesController } from './roles.controller';
import { UsersController } from './users.controller';
import { NetworkPolicyController } from './network.controller';
import { ApplicationController } from './application.controller';
import { MonitorController } from './monitor.controller';
import { TokenController } from './token.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { GPUController } from './gpu.controller';
import { AclController } from './acl.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    UpgradeController,
    BackendController,
    // BackupController,
    RolesController,
    UsersController,
    NetworkPolicyController,
    AclController,
    ApplicationController,
    MonitorController,
    TokenController,
    GPUController,
  ],
  providers: [],
  //exports: [AppStoreController, AppStoreService],
})
export class BFLModule {}
