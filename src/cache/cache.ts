import NodeCache from 'node-cache';
import { ChatSettings } from '../types/grammy.types';
import { AdminInputWithPerm } from '../types/prisma.types';
import { IntRange } from '../types/utils.types';

/**
 * chat_id: chat_title
 */
type AdminChats = {
  [id: number]: string;
};

const Cache = new NodeCache({
  stdTTL: 12 * 60 * 60, //12h in seconds
  checkperiod: 30,
  maxKeys: 50000,
});

// Chat admins
export const admins = {
  set: (chat_id: bigint, admins: Set<AdminInputWithPerm>) => {
    if (!admins.size) return false;
    return Cache.set(getCacheKey.admins(chat_id), admins, 0);
  },

  get: (chat_id: bigint): Set<AdminInputWithPerm> => {
    return Cache.get(getCacheKey.admins(chat_id)) || new Set([]);
  },
};

// Chat
export const chat = {
  settings: {
    set: (chat_id: bigint, settings: Partial<ChatSettings> | 'default') => {
      return Cache.set(getCacheKey.settings(chat_id), settings, 0);
    },

    get: (chat_id: bigint): Partial<ChatSettings> | 'default' | undefined => {
      return Cache.get(getCacheKey.settings(chat_id));
    },
  },

  del: (chat_id: bigint) => {
    admins.get(chat_id).forEach((admin) => adminChats.del(admin.id));
    Cache.del(getCacheKey.admins(chat_id));
    Cache.del(getCacheKey.settings(chat_id));
  },
};

// Admin chats
export const adminChats = {
  set: (admin_id: bigint, chats: AdminChats) => {
    return Cache.set(getCacheKey.adminChats(admin_id), chats, 300);
  },

  get: (admin_id: bigint): AdminChats => {
    return Cache.get(getCacheKey.adminChats(admin_id)) || {};
  },

  del: (admin_id: bigint) => {
    return Cache.del(getCacheKey.adminChats(admin_id));
  },
};

// User stats
export const userStats = {
  get: (user_id: bigint, chat_id: bigint): IntRange<0, 5> => {
    return Cache.get(getCacheKey.userStats(user_id, chat_id)) || 0;
  },

  set: (user_id: bigint, chat_id: bigint, hits: IntRange<0, 5>) => {
    return Cache.set(getCacheKey.userStats(user_id, chat_id), hits);
  },

  del: (user_id: bigint, chat_id: bigint) => {
    return Cache.del(getCacheKey.userStats(user_id, chat_id));
  },
};

const getCacheKey = {
  settings: (chat_id: bigint) => `${chat_id}_settings`,

  admins: (chat_id: bigint) => `${chat_id}_admins`,

  adminChats: (admin_id: bigint) => `${admin_id}_chats`,

  userStats: (user_id: bigint, chat_id: bigint) =>
    `${user_id}_${chat_id}_fours`,
};

export default Cache;
