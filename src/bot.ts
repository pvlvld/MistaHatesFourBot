import { Bot, matchFilter, session } from 'grammy';
import autoRetryTransformer from './transformers/auto-retry.transformer';
import { MyContext } from './types/grammy.types';
import shootHandler from './handlers/shoot.handler';
import i18n from './utils/i18n';
import addFullNameField from './middlewares/addFullNameField.middleware';
import settings_cmd from './commands/settings.command';
import { menu_settings_chats } from './ui/menus/settings.menu';
import votePersentConversation from './ui/conversations/votePersent.conversation';
import { conversations, createConversation } from '@grammyjs/conversations';
import vote_cmd from './commands/vote.command';
import { vote_menu } from './ui/menus/vote.menu';
import chatJoinHandler from './handlers/chatJoin.handler';

// import * as dotenv from 'dotenv';
// dotenv.config({ path: `./.env` });

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

bot.use(conversations());

// MIDDLEWARES
bot.use(addFullNameField);

// CONVERSATIONS
bot.use(createConversation(votePersentConversation));

// MENUS
bot.use(menu_settings_chats);
bot.use(vote_menu);

// Drop channel_post updates
bot.drop(matchFilter('channel_post'));

// Global commands
bot.command('settings', (ctx) => settings_cmd(ctx));

// Separate bot by chat type
const pm = bot.chatType('private');
const gm = bot.chatType(['group', 'supergroup']);

// Chat commands
gm.command('vote', (ctx) => vote_cmd(ctx));

// Handlers
gm.on(':new_chat_members:me', (ctx) => chatJoinHandler(ctx));

gm.on('message', async (ctx) => {
  if (matchFilter(':text')(ctx)) {
    shootHandler(ctx);
  }

  if (matchFilter(':caption')(ctx) && ctx.msg.caption.length <= 10) {
    shootHandler(ctx);
  }
});

export default bot;
