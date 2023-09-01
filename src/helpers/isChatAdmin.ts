import { getAdminChats } from '../db/admins.db';

async function isChatAdmin(user_id: bigint, chat_id: bigint): Promise<boolean> {
  const chats = await getAdminChats(user_id);

  if (!Object.keys(chats).length) return false;

  for (let chat of chats) {
    if (chat.id === chat_id) return true;
  }

  return false;
}

export default isChatAdmin;
