import { type Admin, type Chat, type Settings } from '@prisma/client';

export type ChatInput = Chat;

export type ChatInputWithoutSettings = Omit<Chat, 'settings'>;

export type AdminInput = Admin;

export type AdminInputWithPerm = Admin & {
  has_del_perm: boolean;
};

export type SettingsInput = Settings;

export type SettingsOnly = Omit<Settings, 'id' | 'chatId'> & {
  vote_percent: IntRange<0, 100>;
};

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;
