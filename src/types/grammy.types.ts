import type { ChatTypeContext, Context, Filter } from 'grammy';
import type { Chat, User } from '@grammyjs/types';
import {
  type Conversation,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import DEFAULT_SETTINGS from '../consts/defaultSettings';
import { I18nFlavor } from '@grammyjs/i18n';

export type MyUser = User & {
  full_name: string;
};

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
  I18nFlavor &
  ConversationFlavor & {
    get chat(): MyChat | undefined;
    get from(): MyUser | undefined;
  };

export type MyNotPrivateChat = Exclude<MyChat, Chat.PrivateChat>;

export type MyGroupTextContext = ChatTypeContext<
  Filter<MyContext, ':text'> | Filter<MyContext, ':caption'>,
  'group' | 'supergroup'
>;

export type MyConversation = Conversation<MyContext>;
