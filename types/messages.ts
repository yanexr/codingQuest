import { ISolution } from "./quest";

export interface IMessages {
  messages: IMessage[];
}

export enum IMessageType {
  START,
  USER_QUESTION,
  USER_SUBMISSION,
  ERROR,
  BOT,
  CODE_EXECUTION
}

export interface IMessage {
  type: IMessageType;
  message: string;
  language?: string;
  submission?: number;
  score?: number;
  stdin?: string;
  targetStdout?: string;
  solutions?: ISolution[];
}
