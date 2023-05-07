import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message, User } from './interfaces/chat.interface';
import { ChatServiceService } from './services/chat-service.service';
import { skipLast, takeLast } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  user: User = {
    name: this.makeid(10),
  };

  messageSize = 68;
  messages: Message[] = [];
  message: string = '';

  constructor(protected chat: ChatServiceService) {}

  ngOnInit(): void {
    this.chat.newChatMessage$.subscribe((val: Message) => {
      console.log(val);
      this.messages.push(val);
      this.scrollMessageContainerDown();
    });
  }

  sendMessage(message: string) {
    if (message.trim() === '') return;

    const messageObj: Message = {
      author: this.user.name,
      message: message.trim(),
      sentTime: new Date(),
    };

    this.chat.sendMessage(messageObj);

    this.scrollMessageContainerDown();
  }

  scrollMessageContainerDown() {
    const elementScroll = document.getElementById('messageContainer');

    setTimeout(() => {
      elementScroll?.scrollTo({
        behavior: 'smooth',
        top: elementScroll.scrollHeight,
      });
    }, 100);
  }

  handleSend() {
    this.sendMessage(this.message);
    this.message = '';
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSend();
    }
  }

  makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
