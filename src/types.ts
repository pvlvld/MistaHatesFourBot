import type { Context } from 'grammy';
import type { Chat } from '@grammyjs/types';
import {
  type Conversation,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import DEFAULT_SETTINGS from './consts/defaultSettings';

export type ChatSettings = typeof DEFAULT_SETTINGS;

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
