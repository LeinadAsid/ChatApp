import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ConnChanged, Message } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  newChatMessage$ = this.socket.fromEvent<Message>('newMessage');
  isConnected$ = this.socket.fromEvent<boolean>('connectionConfirmed');
  changeInConnection$ = this.socket.fromEvent<ConnChanged>('numberOfConnChanged');

  constructor(private socket: Socket) { }

  sendMessage(message: Message) {
    this.socket.emit('sentNewMessage', message);
  }
}
