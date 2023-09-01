import { Menu, MenuRange } from '@grammyjs/menu';
import { MyContext } from '../../types/grammy.types';
import { getAdminChatsWithPerm } from '../../db/admins.db';
import { getChatSettings, setChatSettings } from '../../helpers/chatSettings';

export const menu_settings_chats = new Menu<MyContext>('settings-chats')
  .dynamic(async (ctx) => {
    const chats = await getAdminChatsWithPerm(BigInt(ctx.from?.id || -1));
    const range = new MenuRange<MyContext>();

    if (Object.keys(chats).length === 0) {
      return range.text('Чатів не знайдено').row();
    }

    for (const chat of chats) {
      range
        .submenu(chat.name, 'settings-list', () =>
          ctx.editMessageText(`Налаштування: "${chat.name}"\nid: ${chat.id}`)
        )
        .row();
    }
    return range;
  })
  .url('Додати бота в чат', 't.me/MistaHater4bot?startgroup');

const settings_list = new Menu<MyContext>('settings-list').dynamic(
  async (ctx) => {
    const range = new MenuRange<MyContext>();

    range
      .submenu(ctx.t('status'), 'settings-status')
      .row()
      .submenu(`${ctx.t('vote')}`, 'settings-vote')
      .row()
      .back(ctx.t('chat-list'));

    return range;
  }
);

const settings_status = new Menu<MyContext>('settings-status').dynamic(
  async (ctx) => {
    if (!ctx.msg?.text) return;

    const range = new MenuRange<MyContext>();

    const chat_id = BigInt(
      ctx.msg.text.substring(ctx.msg.text.lastIndexOf('-'))
    );
    const chat_settings = await getChatSettings(chat_id);

    range
      .text(
        `${ctx.t('mista')} ${
          chat_settings.mista_enable
            ? ctx.t('status-emoji-on')
            : ctx.t('status-emoji-off')
        }`,
        async (ctx) => {
          chat_settings.mista_enable = !chat_settings.mista_enable;
          await setChatSettings(chat_id, chat_settings);
          ctx.menu.update();
        }
      )
      .row()
      .back(ctx.t('back'));

    return range;
  }
);

const settings_vote = new Menu<MyContext>('settings-vote', {
  autoAnswer: false,
}).dynamic(async (ctx) => {
  if (!ctx.msg?.text) return;

  const range = new MenuRange<MyContext>();
  const chat_id = BigInt(ctx.msg.text.substring(ctx.msg.text.lastIndexOf('-')));
  const chat_settings = await getChatSettings(chat_id);

  range
    .text(
      `${ctx.t('vote')} ${
        chat_settings.vote_enable
          ? ctx.t('status-emoji-on')
          : ctx.t('status-emoji-off')
      }`,
      async (ctx) => {
        chat_settings.vote_enable = !chat_settings.vote_enable;
        await setChatSettings(chat_id, chat_settings);
        ctx.menu.update();
      }
    )
    .row()
    .text(`${chat_settings.vote_percent}%`, async (ctx) => {
      await ctx.reply(`Надішліть бажаний відсоток.\nid: ${chat_id}`, {
        reply_markup: { force_reply: true },
        parse_mode: 'Markdown',
      });

      await ctx.conversation.enter('votePersentConversation');
    })
    .row()
    .text('?', async (ctx) =>
      ctx.answerCallbackQuery({
        show_alert: true,
        text: ctx.t('percent-explanation'),
      })
    )
    .row()
    .back(ctx.t('back'));

  return range;
});

menu_settings_chats.register(settings_list);
settings_list.register(settings_vote);
settings_list.register(settings_status);
