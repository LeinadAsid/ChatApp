export interface Message {
  author: string;
  message: string;
  sentTime: Date;
}

export interface User {
  name: string;
}

export interface ConnChanged {
  oldValue: number;
  newValue: number;
}
