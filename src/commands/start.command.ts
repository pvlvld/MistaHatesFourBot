import { START_IMAGE } from '../consts/media';
import { MyContext } from '../types/grammy.types';

export function start_cmd(ctx: MyContext) {
  if (ctx.chat?.type !== 'private') {
    return;
  }

  ctx.replyWithPhoto(START_IMAGE, {
    caption: ctx.t('start'),
  });
}

export default start_cmd;
