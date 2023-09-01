import { chatPool } from '../cache/cache';
import { MyContext } from '../types/grammy.types';
import { ValueOf } from '../types/utils.types';

const empty_pool = { for: 0, against: 0, voters: new Set([]) };

const VOTE_TO_TEXT_MAP = {
  true: 'for',
  false: 'against',
} as const;

function voteHandler(ctx: MyContext, vote: boolean) {
  if (!ctx.chat || !ctx.from) return;

  let pool = chatPool.get(BigInt(ctx.chat.id));

  if (!pool) pool = empty_pool;

  if (!pool.voters.has(ctx.from.id)) {
    pool[getTextVote(vote)] += 1;
    pool.voters.add(ctx.from.id);

    chatPool.set(BigInt(ctx.chat.id), pool);

    return true;
  }

  return false;
}

function getTextVote(vote: boolean): ValueOf<typeof VOTE_TO_TEXT_MAP> {
  return VOTE_TO_TEXT_MAP[vote.toString() as keyof typeof VOTE_TO_TEXT_MAP];
}

export default voteHandler;
