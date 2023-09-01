import * as Cache from '../cache/cache';
import { MyContext } from '../types/grammy.types';
import * as db from '../db/chats.db';
import AdminsTransformer from './AdminsTransformer';

async function getChatAdmins(ctx: MyContext) {
  if (!ctx.chat) return;
  const chat_id = BigInt(ctx.chat.id);

  // cache
  let admins = Cache.admins.get(chat_id);
  if (admins.size !== 0) return admins;
  // api
  let api_admins = await ctx.getChatAdministrators().catch((e) => {});
  if (typeof api_admins === 'object') {
    return new Set(
      AdminsTransformer.APItoUsable(
        api_admins.filter((admin) => !admin.user.is_bot)
      )
    );
  }
  // db
  admins = new Set(await db.getChatAdmins(chat_id));
  return admins;
}

export default getChatAdmins;
