import type { MyGroupTextContext } from '../types/grammy.types';
import { matchFilter } from 'grammy';
import getRandomInRange from '../utils/getRandomInRange';
import getUserFours from '../helpers/getUserFours';
import muteMember from '../helpers/muteMember';
import { upsertUser } from '../db/users.db';
import { userStats } from '../cache/cache';
import numberRangeLimiter from '../utils/numberRangeLimiter';
import { SHOOT_IMAGE } from '../consts/media';
import { getChatSettings } from '../helpers/chatSettings';

// if (!process.env.RESTRICTED_FOUR) throw new Error('Restricted four required');
// const restricted_four = process.env.RESTRICTED_FOUR.split(' ');
const restricted_four = [
  'чотир',
  'four',
  'vier',
  'quatr',
  'четыр',
  '4',
  'xjnbhb',
  '⁴',
  'четверт',
  'ч о т и р',
  'ч е т в е р т',
  'f o u r',
  'ириточ',
  'čtyři',
  'quattro',
  'квадро',
  'cztery',
  'чoтири', // en o
  'чотиpи', // en p
  'чoтиpи', // en o + p
  '1+1+1+1=',
  '1 + 1 + 1 + 1 =',
];

if (!process.env.HITS_TO_MUTE) throw new Error('Hits to mute required');
const HITS_TO_MUTE = parseInt(process.env.HITS_TO_MUTE);

async function shootHandler(ctx: MyGroupTextContext) {
  let message = '';

  const chat_settings = await getChatSettings(BigInt(ctx.chat.id));

  if (!chat_settings.mista_enable) return;

  if (matchFilter(':text')(ctx)) message = ctx.msg.text.toLowerCase();
  if (matchFilter(':caption')(ctx)) message = ctx.msg.caption.toLowerCase();

  for (let restricted of restricted_four) {
    if (message.includes(restricted)) {
      shoot(ctx);
      break;
    }
  }
}

async function shoot(ctx: MyGroupTextContext) {
  const isShootSuccess = Boolean(getRandomInRange(0, 1));

  let user_fours = await getUserFours(BigInt(ctx.from.id), BigInt(ctx.chat.id));

  if (user_fours === HITS_TO_MUTE) {
    updateUserFoursCount(ctx, 0);
    user_fours = 0;
  }

  let shoots_left = HITS_TO_MUTE - user_fours;

  switch (isShootSuccess) {
    case true:
      shoots_left = HITS_TO_MUTE - updateUserFoursCount(ctx, user_fours);
      ctx.replyWithPhoto(SHOOT_IMAGE, {
        caption: ctx.t('shoot-hit', {
          'shoots-left': shoots_left,
        }),
        reply_to_message_id: ctx.msg.message_id,
      });
      break;

    case false:
      ctx.replyWithPhoto(SHOOT_IMAGE, {
        caption: ctx.t('shoot-miss', { 'shoots-left': shoots_left }),
        reply_to_message_id: ctx.msg.message_id,
      });
      break;
  }

  if (shoots_left <= 0) {
    await muteMember(ctx);
  }
}

function updateUserFoursCount(ctx: MyGroupTextContext, fours: number) {
  const updates_fours = numberRangeLimiter(fours + 1, 0, 4);

  userStats.set(BigInt(ctx.from.id), BigInt(ctx.chat.id), updates_fours);
  upsertUser(ctx, updates_fours);

  return updates_fours;
}

export default shootHandler;
