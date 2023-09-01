import { Menu, MenuRange } from '@grammyjs/menu';
import { MyContext } from '../../types/grammy.types';
import { getAdminChats } from '../../db/admins.db';

export const menu_settings_chats = new Menu<MyContext>('settings-chats')
  .dynamic(async (ctx) => {
    const chats = await getAdminChats(BigInt(ctx.from?.id || -1));
    const range = new MenuRange<MyContext>();

    if (Object.keys(chats).length === 0) {
      return range.text('Чатів не знайдено').row();
    }

    for (const chat of chats) {
      range
        .submenu(chat.name, 'settings-main', () =>
          ctx.editMessageText(`Налаштування: "${chat.name}"\nid: ${chat.id}`)
        )
        .row();
    }
    return range;
  })
  .url('Додати бота в чат', 't.me/MistaHater4bot?startgroup');

const settings_list = new Menu<MyContext>('settings-list').dynamic(
  async (ctx) => {
    const range = new MenuRange<MyContext>();

    range
      .submenu(`${ctx.t('vote')}`, 'settings-vote')
      .row()
      .back(ctx.t('chat-list'));

    return range;
  }
);
