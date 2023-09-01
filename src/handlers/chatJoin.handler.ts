import BOT_OWNER_IDS from '../consts/botOwners';
import { WELCOME_IMAGE } from '../consts/media';
import getChatAdmins from '../helpers/getChatAdmins';
import { MyContext } from '../types/grammy.types';

function chatJoinHandler(ctx: MyContext) {
  if (!ctx.chat || ctx.chat?.type === 'private') return;

  ctx
    .replyWithPhoto(WELCOME_IMAGE, { caption: ctx.t('welcome') })
    .catch(() => {});

  BOT_OWNER_IDS.forEach(async (admin_id) => {
    if (!ctx.chat || ctx.chat?.type === 'private') return;
    ctx.api
      .sendMessage(
        admin_id,
        `Новий чат!\n\nНазва: ${ctx.chat.title}\nЮзернейм: ${
          'username' in ctx.chat ? ctx.chat.username : 'немає'
        }\nАдміни: ${await getAdminsString(ctx)}`
      )
      .catch((e) => {
        console.error(e);
      });
  });
}

async function getAdminsString(ctx: MyContext) {
  const admins = await getChatAdmins(ctx);
  if (!admins) return '-';

  let admins_string = '';

  for (let admin of admins) {
    admins_string += `\nІм'я: ${admin.name} Юзернейм: @${admin.username} Може видаляти повідомлення: ${admin.has_del_perm}`;
  }

  return admins_string;
}

export default chatJoinHandler;
