import { Module } from '@nestjs/common';
import { HeadScaleController } from './headscale.controller';

@Module({
  imports: [],
  controllers: [HeadScaleController],
  providers: [],
})
export class HeadScaleModule {}
