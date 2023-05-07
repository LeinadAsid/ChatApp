import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from './interfaces/ws-gateway.interface';

@WebSocketGateway({ cors: true })
export class WsGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  connSocket: Socket;

  sockets: string[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    this.connSocket.emit('connectionConfirmed', true);

    return this.socketsChanged(client.id);
  }

  handleDisconnect(client: Socket) {
    this.socketsChanged(client.id);
  }

  socketsChanged(clientID: string) {
    const oldValue = this.sockets.length;

    const foundIndex = this.sockets.findIndex((id) => id === clientID);

    if (foundIndex === -1) {
      this.sockets.push(clientID);
    } else {
      this.sockets.splice(foundIndex, 1);
    }

    const message =
      oldValue > this.sockets.length
        ? `Usuário Desconectou | Total Conectados: ${this.sockets.length}`
        : `Usuário Conectou | Total Conectados: ${this.sockets.length}`;

    return this.sendSystemMessage(message);
  }

  sendSystemMessage(message: string) {
    return this.connSocket.to(this.sockets).emit('newMessage', {
      sentTime: new Date(),
      author: '-SYSTEM-',
      message,
    });
  }

  @SubscribeMessage('sentNewMessage')
  handleMessage(@MessageBody() message: Message): WsResponse<Message> {
    if (message.type === 'attach' || message.type === 'messageAttach') {
      const img = Buffer.from(message.message as ArrayBuffer).toString(
        'base64',
      );

      message.message = 'data:image/png;base64,' + img;
    }

    this.connSocket.to(this.sockets).emit('newMessage', message);
    return undefined;
  }
}
