import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  newChatMessage$ = this.socket.fromEvent<Message>('newMessage');
  isConnected$ = this.socket.fromEvent<boolean>('connectionConfirmed');

  constructor(private socket: Socket) { }

  sendMessage(message: Message) {
    this.socket.emit('sentNewMessage', message);
  }
}
