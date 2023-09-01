import { Chat, ChatFromGetChat } from '@grammyjs/types';
import { ChatInput } from '../types/prisma.types';

function APIChatToDBChatTransformer(
  api_chat: ChatFromGetChat | Chat
): ChatInput {
  return {
    id: BigInt(api_chat.id),
    name: `${'title' in api_chat ? api_chat.title : '-'}`,
    username: `${'username' in api_chat ? api_chat.username : null}`,
  };
}

export default APIChatToDBChatTransformer;
