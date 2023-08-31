import * as Cache from '../cache/cache';
import { MyGroupTextContext } from '../types/grammy.types';
import * as db from '../db/chats.db';
import { AdminInputWithPerm } from '../types/prisma.types';
import { ChatMemberAdministrator, ChatMemberOwner } from '@grammyjs/types';

async function getChatAdmins(ctx: MyGroupTextContext) {
  const chat_id = BigInt(ctx.chat.id);

  // cache
  let admins = Cache.admins.get(chat_id);
  if (admins.size !== 0) return admins;
  // api
  let api_admins = await ctx.getChatAdministrators().catch((e) => {});
  if (typeof api_admins === 'object') {
    return formatAPIAdmins(api_admins);
  }
  // db
  admins = new Set(await db.getChatAdmins(chat_id));
  return admins;
}

function formatAPIAdmins(
  admins: (ChatMemberOwner | ChatMemberAdministrator)[]
): Set<AdminInputWithPerm> {
  const formatedAdmins = new Set([]) as Set<AdminInputWithPerm>;

  admins.forEach((admin) => {
    formatedAdmins.add({
      id: BigInt(admin.user.id),
      name: `${admin.user.first_name} ${admin.user.last_name || ''}`.trim(),
      username: admin.user.username || null,
      has_del_perm: admin.status === 'creator' || admin.can_delete_messages,
    });
  });

  return formatedAdmins;
}

export default getChatAdmins;
