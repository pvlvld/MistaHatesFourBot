import { WELCOME_IMAGE } from '../consts/media';
import { MyContext } from '../types/grammy.types';

function chatJoinHandler(ctx: MyContext) {
  ctx
    .replyWithPhoto(WELCOME_IMAGE, { caption: ctx.t('welcome') })
    .catch(() => {});
}

export default chatJoinHandler;
