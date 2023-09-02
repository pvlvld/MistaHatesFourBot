import { getChatSettings, setChatSettings } from '../helpers/chatSettings';
import { isFromAdminWithDelPerm } from '../helpers/isFromAdmin';
import { MyGroupTextContext } from '../types/grammy.types';

async function sleep_cmd(ctx: MyGroupTextContext) {
  if (!(await isFromAdminWithDelPerm(ctx))) return;

  const chat_settings = await getChatSettings(BigInt(ctx.chat.id));
  chat_settings.mista_enable = !chat_settings.mista_enable;

  setChatSettings(BigInt(ctx.chat.id), chat_settings);

  switch (chat_settings.mista_enable) {
    case true:
      ctx.reply(ctx.t('mista-wakeup'));
      break;

    case false:
      ctx.reply(ctx.t('mista-sleep'));
      break;
  }
}

export default sleep_cmd;
