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

    console.log('handling Connection');

    this.socketsChanged(client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('handling Disconnection');

    this.socketsChanged(client.id);
  }

  socketsChanged(clientID: string) {
    console.log('socketsChanged');

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

    this.sendSystemMessage(message);
  }

  sendSystemMessage(message: string) {
    console.log('sendSystemMessage');

    this.connSocket.to(this.sockets).emit('newMessage', {
      sentTime: new Date(),
      author: '-SYSTEM-',
      message,
    });
  }

  @SubscribeMessage('sentNewMessage')
  handleMessage(@MessageBody() message: Message): WsResponse<Message> {
    this.connSocket.to(this.sockets).emit('newMessage', message);
    return undefined;
  }
}
