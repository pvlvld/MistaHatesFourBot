import { type Admin, type Chat, type Settings } from '@prisma/client';
import { IntRange } from './utils.types';

export type ChatInput = Chat;

export type ChatInputWithoutSettings = Omit<Chat, 'settings'>;

export type AdminInput = Admin;

export type AdminInputWithPerm = Admin & {
  has_del_perm: boolean;
};

export type SettingsInput = Settings;

export type SettingsOnly = Omit<Settings, 'id' | 'chatId'> & {
  vote_percent: IntRange<0, 101>;
};
