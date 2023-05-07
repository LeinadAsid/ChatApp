export interface Message {
  author: string;
  message: string | ArrayBuffer;
  sentTime: Date;
  type?: MessageTypes;
}

export interface User {
  name: string;
}

export type MessageTypes = 'message' | 'attach' | 'messageAttach';
