import * as Cache from '../cache/cache';
import * as UsersDB from '../db/users.db';

async function getUserFours(user_id: bigint, chat_id: bigint) {
  return (
    Cache.userStats.get(user_id, chat_id) ||
    UsersDB.getUserFours(user_id, chat_id)
  );
}

export default getUserFours;
