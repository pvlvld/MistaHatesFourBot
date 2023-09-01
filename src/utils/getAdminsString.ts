import getChatAdmins from '../helpers/getChatAdmins';
import { MyContext } from '../types/grammy.types';

async function getAdminsString(ctx: MyContext) {
  const admins = await getChatAdmins(ctx);
  if (!admins) return '-';

  let admins_string = '';

  for (let admin of admins) {
    admins_string += `\nІм'я: ${admin.name} Юзернейм: @${admin.username} Може видаляти повідомлення: ${admin.has_del_perm}`;
  }

  return admins_string;
}

export default getAdminsString;
