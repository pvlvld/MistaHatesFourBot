import prisma from './prismaClient.db';

export async function getUserFours(user_id: bigint, chat_id: bigint) {
  return (
    (
      await prisma.user.findUnique({
        where: { user_id_chat_id: { user_id, chat_id } },
        select: { fours: true },
      })
    )?.fours || 0
  );
}
