import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class ChatComponent implements OnInit, AfterViewInit {
  user: User = {
    name: '',
  };

  messageSize = 68;
  messages: Message[] = [];
  message: string = '';

  chosenName = '';

  modalEl: HTMLDialogElement | undefined = undefined;

  playingAudio = false;
  audioEnabled = false;

  constructor(protected chat: ChatServiceService) {}

  ngOnInit(): void {
    this.chat.newChatMessage$.subscribe((val: Message) => {
      this.messages.push(val);

      this.scrollMessageContainerDown();

      if (val.author !== this.user.name && val.author !== '-SYSTEM-') {
        this.playReceivedAudio();
      }
    });
  }

  ngAfterViewInit() {
    this.modalEl = document.getElementById(
      'chooseNameModal'
    ) as HTMLDialogElement;

    if (!this.user.name || this.user.name === '') {
      this.modalEl.showModal();
    }
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

  chooseName(name: string) {
    if (name === '' || !name) return;

    this.user.name = name;
    this.chosenName = '';
    this.modalEl?.close();
  }

  async checkPasteContent(evt: ClipboardEvent) {
    const fileToSend = evt.clipboardData?.files[0];

    if (!fileToSend) return;

    this.emitFileMessage(fileToSend);
  }

  handleInput(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  handleDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    const fileToSend = evt.dataTransfer?.files[0];

    if (!fileToSend) return;

    this.emitFileMessage(fileToSend);
  }

  emitFileMessage(fileToSend: File) {
    if (!fileToSend) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const rawData = e.target?.result;

      if (!rawData) return;

      this.chat.sendMessage({
        type: 'attach',
        message: rawData,
        author: this.user.name,
        sentTime: new Date(),
      });
    };

    reader.readAsArrayBuffer(fileToSend);
  }

  async playReceivedAudio() {
    if (this.playingAudio || !this.audioEnabled) return;

    this.playingAudio = true;
    const audio = new Audio('../../assets/audio/msnaudio.mp3');
    await audio.play();

    audio.onended = () => {
      this.playingAudio = false;
    };
  }
}
