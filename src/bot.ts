import { Bot, matchFilter, session } from 'grammy';
import autoRetryTransformer from './transformers/auto-retry.transformer';
import { MyContext } from './types/grammy.types';
import shootHandler from './handlers/shoot.handler';
import i18n from './utils/i18n';

import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env` });

if (!process.env.BOT_TOKEN) throw new Error('Token required');

const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

// TRANSFORMERS
bot.api.config.use(autoRetryTransformer);

// PLUGINS
// Install the session plugin.
bot.use(
  session({
    initial() {
      return {};
    },
  })
);

bot.use(i18n);
// Drop channel_post updates
bot.drop(matchFilter('channel_post'));

// Separate bot by chat type
const pm = bot.chatType('private');
const gm = bot.chatType(['group', 'supergroup']);

// Handlers
gm.on(':photo', (ctx) => console.log(ctx.msg));
gm.on('message', async (ctx) => {
  if (matchFilter(':text')(ctx)) {
    shootHandler(ctx);
  }

  if (matchFilter(':caption')(ctx) && ctx.msg.caption.length <= 10) {
    shootHandler(ctx);
  }
});

export default bot;
