import { getChatSettings, setChatSettings } from '../../helpers/chatSettings';
import isChatAdmin from '../../helpers/isChatAdmin';
import { MyContext, MyConversation } from '../../types/grammy.types';
import numberRangeLimiter from '../../utils/numberRangeLimiter';

async function votePersentConversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  if (ctx.chat?.type !== 'private') return;

  const userInputMsg = await conversation.wait();
  const chatIdMsg = userInputMsg?.msg?.reply_to_message;
  if (!chatIdMsg) return;

  userInputMsg.deleteMessage().catch(() => {});
  ctx.api.deleteMessage(ctx.chat.id, chatIdMsg.message_id).catch(() => {});

  let newVotePersent = numberRangeLimiter(
    parseInt(userInputMsg.msg.text || '0'),
    1,
    100
  );
  if (!newVotePersent) return;

  const requestMsgText = chatIdMsg.text;
  if (!requestMsgText) return;

  const chat_id = BigInt(
    requestMsgText.substring(requestMsgText.lastIndexOf('-'))
  );
  if (!chat_id) return;

  if (!(await isChatAdmin(BigInt(ctx.chat.id), chat_id))) return;

  const settings = await getChatSettings(chat_id);
  settings.vote_percent = newVotePersent;

  await setChatSettings(chat_id, settings);

  ctx
    .answerCallbackQuery({
      show_alert: true,
      text: `Встановлено відсоток ${newVotePersent}%.`,
    })
    .catch((e: any) => {
      console.error(e);
    });
}

export default votePersentConversation;
