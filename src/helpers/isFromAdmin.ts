import { MyGroupTextContext } from '../types/grammy.types';
import getChatAdmins from './getChatAdmins';

async function isFromAdmin(ctx: MyGroupTextContext) {
  const admins = await getChatAdmins(ctx);
  if (!admins) return false;

  return (
    [...admins].findIndex((admin) => admin.id === BigInt(ctx.from.id)) !== -1
  );
}

export async function isFromAdminWithDelPerm(ctx: MyGroupTextContext) {
  const admins = await getChatAdmins(ctx);
  if (!admins) return false;

  for (let admin of admins) {
    if (admin.id === BigInt(ctx.from.id)) {
      if (admin.has_del_perm) {
        return true;
      } else {
        return false;
      }
    }
  }

  return false;
}

export default isFromAdmin;
