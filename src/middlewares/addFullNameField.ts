import type { NextFunction } from 'grammy';
import { MyContext } from '../types/grammy.types';

async function addFullNameField(ctx: MyContext, next: NextFunction) {
  if (ctx.from) {
    ctx.from.full_name = `${ctx.from.first_name} ${
      ctx.from.last_name || ''
    }`.trim();
  }

  await next();
}

export default addFullNameField;
