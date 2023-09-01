import BOT_OWNER_IDS from '../consts/botOwners';
import { WELCOME_IMAGE } from '../consts/media';
import * as ChatsDB from '../db/chats.db';
import { MyContext } from '../types/grammy.types';
import getAdminsString from '../utils/getAdminsString';

function chatLeaveHandler(ctx: MyContext) {
  if (!ctx.chat || ctx.chat?.type === 'private') return;

  ctx
    .replyWithPhoto(WELCOME_IMAGE, { caption: ctx.t('welcome') })
    .catch(() => {});

  BOT_OWNER_IDS.forEach(async (admin_id) => {
    if (!ctx.chat || ctx.chat?.type === 'private') return;
    ctx.api
      .sendMessage(
        admin_id,
        `Мене кікнули з чату!\n\nНазва: ${ctx.chat.title}\nЮзернейм: ${
          'username' in ctx.chat ? ctx.chat.username : 'немає'
        }\nАдміни: ${await getAdminsString(ctx)}`
      )
      .catch((e) => {
        console.error(e);
      });
  });

  ChatsDB.remove(BigInt(ctx.chat.id));
}

export default chatLeaveHandler;
