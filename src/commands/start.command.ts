import { START_IMAGE } from '../consts/media';
import { MyContext } from '../types/grammy.types';
import { start_menu } from '../ui/menus/start.menu';

export function start_cmd(ctx: MyContext) {
  if (ctx.chat?.type !== 'private') {
    return;
  }

  ctx.replyWithPhoto(START_IMAGE, {
    caption: ctx.t('start'),
    reply_markup: start_menu,
  });
}

export default start_cmd;
