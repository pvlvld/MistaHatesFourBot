import prisma from './prismaClient.db';

export async function getUserFours(user_id: bigint) {
  return (
    (
      await prisma.user.findUnique({
        where: { id: user_id },
        select: { fours: true },
      })
    )?.fours || 0
  );
}
