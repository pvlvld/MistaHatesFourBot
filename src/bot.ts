import { Bot, session } from 'grammy';
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

// Handlers
bot.on(':text', async (ctx) => shootHandler(ctx));

export default bot;
