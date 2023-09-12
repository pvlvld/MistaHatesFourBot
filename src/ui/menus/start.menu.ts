import { Menu, MenuRange } from '@grammyjs/menu';
import { MyContext } from '../../types/grammy.types';

export const start_menu = new Menu<MyContext>('start-menu').dynamic(
  async (ctx) => {
    const range = new MenuRange<MyContext>();

    range.url(ctx.t('add-to-chat'), 't.me/MistaHater4bot?startgroup');

    return range;
  }
);
