import { MyContext } from '../types/grammy.types';

function chatJoinHandler(ctx: MyContext) {
  ctx.reply(ctx.t('welcome-message')).catch(() => {});
}

export default chatJoinHandler;
