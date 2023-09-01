import { Menu, MenuRange } from '@grammyjs/menu';
import { MyContext } from '../../types/grammy.types';
import { chatPool } from '../../cache/cache';
import voteHandler from '../../handlers/vote.handler';
import { Pool } from '../../types/other.types';

export const vote_menu = new Menu<MyContext>('vote-menu').dynamic(
  async (ctx) => {
    const range = new MenuRange<MyContext>();
    const pool = getPool(ctx);

    range
      .text(`👍🏻 ${pool.for}`, (ctx) => {
        if (voteHandler(ctx, true)) ctx.menu.update();
      })
      .text(`👎🏻 ${pool.against}`, async (ctx) => {
        if (voteHandler(ctx, false)) ctx.menu.update();
      });

    return range;
  }
);

function getPool(ctx: MyContext): Pool {
  const empty_pool = { for: 0, against: 0, voters: new Set([]) };

  if (!ctx.chat) return empty_pool;
  return chatPool.get(BigInt(ctx.chat.id)) || empty_pool;
}
