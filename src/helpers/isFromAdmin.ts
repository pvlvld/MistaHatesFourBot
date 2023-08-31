import { MyGroupTextContext } from '../types/grammy.types';
import getChatAdmins from './getChatAdmins';

async function isFromAdmin(ctx: MyGroupTextContext) {
  const admins = await getChatAdmins(ctx);

  return Boolean(
    [...admins].findIndex((admin) => admin.id === BigInt(ctx.from.id))
  );
}

export default isFromAdmin;
