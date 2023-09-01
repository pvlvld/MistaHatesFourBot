import prisma from './prismaClient.db';
import { MyGroupTextContext } from '../types/grammy.types';
import DEFAULT_SETTINGS from '../consts/defaultSettings';
import AdminsTransformer from '../helpers/AdminsTransformer';

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

export async function upsertUser(ctx: MyGroupTextContext, fours: number) {
  const isUserExist = Boolean(
    await prisma.user.findUnique({
      where: { userId_chatId: { userId: ctx.from.id, chatId: ctx.chat.id } },
    })
  );

  switch (isUserExist) {
    case true:
      updateUser(ctx, fours);
      break;

    case false:
      createUser(ctx, fours);
      break;
  }
}
async function createUser(ctx: MyGroupTextContext, fours: number) {
  prisma.user.create({
    data: {
      userId: ctx.from.id,
      name: ctx.from.full_name,
      username: `${ctx.from.username || null}`,
      fours,
      chat: {
        connectOrCreate: {
          where: { id: ctx.chat.id },
          create: {
            id: ctx.chat.id,
            name: ctx.chat.title,
            username: `${'username' in ctx.chat ? ctx.chat.username : null}`,
            settings: { create: DEFAULT_SETTINGS },
            admins: {
              create: await genCreateAdmins(ctx),
            },
          },
        },
      },
    },
  });
}

function updateUser(ctx: MyGroupTextContext, fours: number) {
  prisma.user.update({
    where: { userId_chatId: { userId: ctx.from.id, chatId: ctx.chat.id } },
    data: {
      userId: ctx.from.id,
      name: ctx.from.full_name,
      username: `${ctx.from.username || null}`,
      fours,
    },
  });
}

async function genCreateAdmins(ctx: MyGroupTextContext) {
  return AdminsTransformer.APItoUsable(await ctx.getChatAdministrators()).map(
    (admin) => ({
      has_del_perm: admin.has_del_perm,
      admin: {
        create: {
          id: admin.id,
          name: admin.name,
          username: admin.username,
        },
      },
    })
  );
}
