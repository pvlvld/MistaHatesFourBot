import * as cache from '../cache/cache';
import bot from '../bot';
import DEFAULT_SETTINGS from '../consts/defaultSettings';
import { ChatSettings } from '../types/grammy.types';
import APIChatToDBChatTransformer from './APIChatToDBChatTransformer';
import * as ChatsDB from '../db/chats.db';
import AdminsTransformer from './AdminsTransformer';

export async function getChatSettings(chat_id: bigint): Promise<ChatSettings> {
  const DEFAULT_CHAT_SETTINGS_COPY = {
    ...DEFAULT_SETTINGS,
  };

  let settings: ChatSettings | undefined | null;

  //Cache
  settings = cache.chat.settings.get(chat_id);
  if (settings) {
    return settings;
  }

  //BD
  if (!settings) settings = await ChatsDB.getChatSettings(chat_id);
  if (settings) {
    cache.chat.settings.set(chat_id, settings);
    return settings;
  }

  if (!settings) {
    setChatSettings(chat_id, DEFAULT_CHAT_SETTINGS_COPY);
  }

  return DEFAULT_CHAT_SETTINGS_COPY;
}

export async function setChatSettings(chat_id: bigint, settings: ChatSettings) {
  cache.chat.settings.set(chat_id, settings);

  const chat = await bot.api
    .getChat(Number(chat_id))
    .catch((e) => console.error(e));
  const api_admins = await bot.api
    .getChatAdministrators(Number(chat_id))
    .catch((e) => console.error(e));

  if (api_admins && chat)
    ChatsDB.upsertChatWithAdmins(
      APIChatToDBChatTransformer(await bot.api.getChat(Number(chat.id))),
      settings,
      AdminsTransformer.APItoUsable(api_admins)
    );
}
