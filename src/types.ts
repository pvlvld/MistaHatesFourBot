import type { Context } from 'grammy';
import type { Chat } from '@grammyjs/types';
import {
  type Conversation,
  type ConversationFlavor,
} from '@grammyjs/conversations';

export type ChatSettings = {};

type MyGroupChat = Chat.GroupChat & {
  settings: ChatSettings;
};

type MySupergroupChat = Chat.SupergroupChat & {
  settings: ChatSettings;
};

export type MyChat =
  | Chat.PrivateChat
  | Chat.ChannelChat
  | MyGroupChat
  | MySupergroupChat;

export type MyContext = Context &
  ConversationFlavor & {
    get chat(): MyChat | undefined;
  };

export type MyConversation = Conversation<MyContext>;

export type MyContext2 = Context;

export type MyContext3 = Context;

export type MyContext4 = Context;

export type MyContext5 = Context;

export type MyContext6 = Context;

export type MyContext7 = Context;


