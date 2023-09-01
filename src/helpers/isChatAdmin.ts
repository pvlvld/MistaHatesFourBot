import { getAdminChats } from '../db/admins.db';

async function isChatAdmin(user_id: bigint, chat_id: bigint): Promise<boolean> {
  const groups = await getAdminChats(user_id);

  if (!Object.keys(groups).length) return false;

  return Object.hasOwn(groups, Number(chat_id));
}

export default isChatAdmin;
