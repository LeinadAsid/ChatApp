import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsGatewayModule } from './gateway/ws-gateway/ws-gateway.module';

@Module({
  imports: [WsGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
