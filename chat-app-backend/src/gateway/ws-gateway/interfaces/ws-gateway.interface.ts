/* eslint-disable prettier/prettier */

export interface Message {
  author: string;
  message: string | ArrayBuffer;
  sentTime: Date;
  type?: MessageTypes;
}

export type MessageTypes = 'message' | 'attach' | 'messageAttach';
