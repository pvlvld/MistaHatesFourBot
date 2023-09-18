// https://github.com/grammyjs/auto-thread
import type { Context, MiddlewareFn } from 'grammy';

const METHODS = new Set([
  'sendMessage',
  'sendPhoto',
  'sendVideo',
  'sendAnimation',
  'sendAudio',
  'sendDocument',
  'sendSticker',
  'sendVideoNote',
  'sendVoice',
  'sendLocation',
  'sendVenue',
  'sendContact',
  'sendPoll',
  'sendDice',
  'sendInvoice',
  'sendGame',
  'sendMediaGroup',
  'copyMessage',
  'forwardMessage ',
]);

function autoThread<C extends Context>(): MiddlewareFn<C> {
  return async (ctx, next) => {
    const message_thread_id = ctx.msg?.message_thread_id;
    if (message_thread_id !== undefined) {
      ctx.api.config.use(async (prev, method, payload, signal) => {
        if (!('message_thread_id' in payload) && METHODS.has(method)) {
          Object.assign(payload, { message_thread_id });
        }
        return await prev(method, payload, signal);
      });
    }
    await next();
  };
}

export default autoThread;
