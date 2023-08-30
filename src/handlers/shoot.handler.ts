import type { MyContext } from '../types/grammy.types';
import { matchFilter, type Filter } from 'grammy';
import getRandomInRange from '../utils/getRandomInRange';

const restricted_four = ['чотир', 'four', 'vier', 'quatr', 'четыр', '4'];

function shootHandler(
  ctx: Filter<MyContext, ':text'> | Filter<MyContext, ':caption'>
) {
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

function shoot(ctx: MyContext) {
  const isShootSuccess = Boolean(getRandomInRange(0, 1));

  switch (isShootSuccess) {
    case true:
      ctx.reply(ctx.t('shoot-hit'));
      break;

    case false:
      ctx.reply(ctx.t('shoot-miss'));
      break;
  }
}

export default shootHandler;
