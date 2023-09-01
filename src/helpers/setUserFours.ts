import * as Cache from '../cache/cache';
import * as UsersDB from '../db/users.db';
import { MyGroupTextContext } from '../types/grammy.types';

async function setUserFours(ctx: MyGroupTextContext, hits: number) {
  Cache.userStats.set(BigInt(ctx.from.id), BigInt(ctx.chat.id), hits);
  await UsersDB.upsertUser(ctx, hits);
}

export default setUserFours;
