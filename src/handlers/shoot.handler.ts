import type { MyGroupTextContext } from '../types/grammy.types';
import { matchFilter } from 'grammy';
import getRandomInRange from '../utils/getRandomInRange';
import getUserFours from '../helpers/getUserFours';
import muteMember from '../helpers/muteMember';
import { upsertUser } from '../db/users.db';
import { userStats } from '../cache/cache';
import numberRangeLimiter from '../utils/numberRangeLimiter';

if (!process.env.RESTRICTED_FOUR) throw new Error('Restricted four required');
const restricted_four = process.env.RESTRICTED_FOUR.split(' ');

if (!process.env.SHOOT_IMAGE) throw new Error('Shoot image required');
const SHOOT_IMAGE = process.env.SHOOT_IMAGE;

if (!process.env.HITS_TO_MUTE) throw new Error('Hits to mute required');
const HITS_TO_MUTE = parseInt(process.env.HITS_TO_MUTE);

function shootHandler(ctx: MyGroupTextContext) {
  let message = '';

  if (matchFilter(':text')(ctx)) message = ctx.msg.text;
  if (matchFilter(':caption')(ctx)) message = ctx.msg.caption;

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
      });
      break;

    case false:
      ctx.replyWithPhoto(SHOOT_IMAGE, {
        caption: ctx.t('shoot-miss', { 'shoots-left': shoots_left }),
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
