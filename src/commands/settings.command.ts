import { MyContext } from '../types/grammy.types';
import { menu_settings_chats } from '../ui/menus/settings.menu';

export function settings_cmd(ctx: MyContext) {
  if (ctx.chat?.type === 'private') {
    ctx.reply('🕺🏻', { reply_markup: menu_settings_chats });
    return;
  }
  ctx.reply(
    'Налаштування доступні в [діалозі з ботом.](tg://resolve?domain=MistaHater4bot&start=start)',
    {
      parse_mode: 'Markdown',
    }
  );
}

export default settings_cmd;
