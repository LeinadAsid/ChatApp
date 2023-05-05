import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from './interfaces/ws-gateway.interface';

@WebSocketGateway({ cors: true })
export class WsGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  connSocket: Socket;

  sockets: string[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    this.connSocket.emit('connectionConfirmed', true);
    this.sockets.push(client.id);
  }

  @SubscribeMessage('sentNewMessage')
  handleMessage(@MessageBody() message: Message): WsResponse<Message> {
    this.connSocket.to(this.sockets).emit('newMessage', message);
    return undefined;
  }
}
