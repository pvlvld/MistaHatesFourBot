import * as Cache from '../cache/cache';
import { MyGroupTextContext } from '../types/grammy.types';
import * as db from '../db/chats.db';
import AdminsTransformer from './AdminsTransformer';

async function getChatAdmins(ctx: MyGroupTextContext) {
  const chat_id = BigInt(ctx.chat.id);

  // cache
  let admins = Cache.admins.get(chat_id);
  if (admins.size !== 0) return admins;
  // api
  let api_admins = await ctx.getChatAdministrators().catch((e) => {});
  if (typeof api_admins === 'object') {
    return AdminsTransformer.APItoUsable(api_admins);
  }
  // db
  admins = new Set(await db.getChatAdmins(chat_id));
  return admins;
}

export default getChatAdmins;
