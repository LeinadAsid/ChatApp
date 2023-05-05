import { Module } from '@nestjs/common';
import { WsGatewayGateway } from './ws-gateway.gateway';

@Module({
  imports: [WsGatewayGateway],
})
export class WsGatewayModule {}
