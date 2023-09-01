import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env` });

import { GrammyError, HttpError } from 'grammy';
import bot from './bot';
import prisma from './db/prismaClient.db';

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log('Node NOT Exiting...');
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

bot
  .start({
    drop_pending_updates: true,
    allowed_updates: [
      'message',
      'chat_member',
      'edited_message',
      'callback_query',
    ],
  })
  .then(() => {
    console.log('Bot is started.');
  });

process.on('SIGINT', async () => await shutdown());
process.on('SIGTERM', async () => await shutdown());

let shutdownCounter = 0;

async function shutdown() {
  if (shutdownCounter) return;
  shutdownCounter++;

  await bot.stop().then(() => {
    console.log('- Bot stopped.');
  });

  await prisma.$disconnect().then(() => {
    console.log('- Prisma disconnected.');
  });

  console.log('Done.');
  process.exit();
}
