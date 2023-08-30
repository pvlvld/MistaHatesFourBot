import { Bot, Context } from 'grammy';
import autoRetryTransformer from './transformers/auto-retry.transformer';

if (!process.env.BOT_TOKEN) throw new Error('Token required');

type MyContext = Context;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

bot.use(autoRetryTransformer);

