import prisma from './prismaClient.db';

export async function getUserFours(user_id: bigint, chat_id: bigint) {
  return (
    (
      await prisma.user.findUnique({
        where: { userId_chatId: { userId: user_id, chatId: chat_id } },
        select: { fours: true },
      })
    )?.fours || 0
  );
}
