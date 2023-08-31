import type { MyGroupTextContext } from '../types/grammy.types';
import { matchFilter } from 'grammy';
import getRandomInRange from '../utils/getRandomInRange';
import { userStats } from '../cache/cache';

if (!process.env.RESTRICTED_FOUR) throw new Error('Restricted four required');

const restricted_four = process.env.RESTRICTED_FOUR.split(' ');

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

function shoot(ctx: MyGroupTextContext) {
  const isShootSuccess = Boolean(getRandomInRange(0, 1));
  const shoots_left = userStats.get(BigInt(ctx.from.id), BigInt(ctx.chat.id));

  switch (isShootSuccess) {
    case true:
      ctx.replyWithPhoto(
        'AgACAgIAAxkBAAMxZO-OyvxB7f1LkexOugPj4UAxJ6kAAuHLMRtYwoBLOkEdf-uUbk0BAAMCAAN4AAMwBA',
        {
          caption: ctx.t('shoot-hit', {
            'shoots-left': shoots_left,
          }),
        }
      );
      break;

    case false:
      ctx.replyWithPhoto(
        'AgACAgIAAxkBAAMxZO-OyvxB7f1LkexOugPj4UAxJ6kAAuHLMRtYwoBLOkEdf-uUbk0BAAMCAAN4AAMwBA',
        { caption: ctx.t('shoot-miss', { 'shoots-left': shoots_left }) }
      );
      break;
  }
}

export default shootHandler;
