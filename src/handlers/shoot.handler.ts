import type { MyGroupTextContext } from '../types/grammy.types';
import { matchFilter } from 'grammy';
import getRandomInRange from '../utils/getRandomInRange';

const restricted_four = ['чотир', 'four', 'vier', 'quatr', 'четыр', '4'];

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
