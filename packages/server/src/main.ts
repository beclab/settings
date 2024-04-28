import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { WsAdapter } from './ws.adapter';
//import * as cookieParser from 'cookie-parser';
//import { WsAdapter } from '@nestjs/websockets';
//import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //app.use(requestIp.mw());
  //app.use(cookieParser);
  //app.useWebSocketAdapter(new WsAdapter(app)); // 使用我们的适配器
  await app.listen(3010);
}
bootstrap();
