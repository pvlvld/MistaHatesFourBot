import { chatPool } from '../cache/cache';
import POOL_TIME from '../consts/poolTime';
import { MyGroupTextContext } from '../types/grammy.types';
import { vote_menu } from '../ui/menus/vote.menu';

export async function vote_cmd(ctx: MyGroupTextContext) {
  if (chatPool.get(BigInt(ctx.chat.id))) return;

  const pool_message = await ctx.reply('Голосування', {
    reply_markup: vote_menu,
  });

  setTimeout(() => {
    const pool_result = chatPool.get(BigInt(ctx.chat.id));
    ctx.api.deleteMessage(ctx.chat.id, pool_message.message_id);
    ctx.reply(
      `Голосування закінчилось, результати:\nЗа: ${pool_result?.for}\nПроти: ${pool_result?.against}`
    );
  }, POOL_TIME * 1000);
}

export default vote_cmd;
