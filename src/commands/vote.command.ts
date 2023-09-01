import { chatPool } from '../cache/cache';
import POOL_TIME from '../consts/poolTime';
import { getChatSettings } from '../db/chats.db';
import { setChatSettings } from '../helpers/chatSettings';
import { MyGroupTextContext } from '../types/grammy.types';
import { vote_menu } from '../ui/menus/vote.menu';
import SettingsTransformer from '../helpers/SettingsTransformer';

export async function vote_cmd(ctx: MyGroupTextContext) {
  if (chatPool.get(BigInt(ctx.chat.id))) return;
  const chat_settings = SettingsTransformer.DBtoUsable(
    await getChatSettings(BigInt(ctx.chat.id))
  );

  if (!chat_settings?.vote_enable) return;

  const pool_message = await ctx.reply(ctx.t('vote'), {
    reply_markup: vote_menu,
  });

  setTimeout(async () => {
    const pool_result = chatPool.get(BigInt(ctx.chat.id));
    chatPool.del(BigInt(ctx.chat.id));
    ctx.api.deleteMessage(ctx.chat.id, pool_message.message_id);
    if (!pool_result) return;

    const isStatusChange = pool_result.for > pool_result.against;

    if (!isStatusChange) return;

    switch (chat_settings.mista_enable) {
      case true:
        ctx.reply(ctx.t('mista-wakeup'));
        break;

      case false:
        ctx.reply(ctx.t('mista-sleep'));
        break;
    }

    chat_settings.mista_enable = !chat_settings.mista_enable;
    setChatSettings(BigInt(ctx.chat.id), chat_settings);
  }, POOL_TIME * 1000);
}

export default vote_cmd;
