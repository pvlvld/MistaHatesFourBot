import { Chat, Prisma } from '@prisma/client';
import prisma from './prismaClient.db';
import { AdminInputWithPerm } from '../types/prisma.types';
import { ChatSettings } from '../types/grammy.types';
import AdminsTransformer from '../helpers/AdminsTransformer';

export const upsertChatWithAdmins = async (
  chat: Chat,
  settings: ChatSettings,
  admins: AdminInputWithPerm[]
) => {
  if (await get(BigInt(chat.id))) {
    update(chat, settings, admins);
  } else {
    create(chat, settings, admins);
  }
};

export const create = async (
  chat: Chat,
  settings: ChatSettings,
  admins: AdminInputWithPerm[]
) => {
  return await prisma.chat
    .create({
      data: {
        ...chat,
        settings: {
          create: settings,
        },
        admins: {
          connectOrCreate: [...admins].map((admin) => ({
            where: { adminId_chatId: { adminId: admin.id, chatId: chat.id } },
            create: {
              has_del_perm: admin.has_del_perm,
              admin: {
                create: {
                  id: admin.id,
                  name: admin.name,
                  username: admin.username,
                },
              },
            },
          })),
        },
      },
    })
    .catch((e: any) => {
      console.error(e);
      return null;
    });
};

export const update = async (
  chat: Chat,
  settings: ChatSettings,
  admins: AdminInputWithPerm[]
) => {
  return await prisma.chat
    .update({
      where: { id: chat.id },
      data: {
        ...chat,
        settings: {
          upsert: {
            where: { chatId: chat.id },
            update: settings,
            create: settings,
          },
        },
        admins: {
          connectOrCreate: [...admins].map((admin) => ({
            where: { adminId_chatId: { adminId: admin.id, chatId: chat.id } },
            create: {
              has_del_perm: admin.has_del_perm,
              admin: {
                create: {
                  id: admin.id,
                  name: admin.name,
                  username: admin.username,
                },
              },
            },
          })),
        },
      },
    })
    .catch((e: any) => {
      console.error(e);
      return null;
    });
};

export const get = async (id: bigint) => {
  return await prisma.chat.findUnique({ where: { id } }).catch((e: any) => {
    console.error(e);
    return null;
  });
};

export async function getChatAdmins(chat_id: bigint) {
  return AdminsTransformer.DBtoUsable(
    await prisma.adminToChat.findMany({
      where: { chatId: chat_id },
      select: { admin: true, has_del_perm: true },
    })
  );
}

export async function getChatSettings(chat_id: bigint) {
  return (
    await prisma.chat.findUnique({
      where: { id: chat_id },
      select: { settings: true },
    })
  )?.settings;
}

export async function updateChatSettings(
  chat_id: bigint,
  settings: ChatSettings
) {
  return await prisma.settings.update({
    where: { chatId: chat_id },
    data: settings,
  });
}

export const remove = async (id: bigint) => {
  await prisma.chat.delete({ where: { id } }).catch((e: any) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Dont throw an error in case when admin to del is not found
      // if (e.code === 'P2025') return;
    }
    console.error(e);
    return null;
  });

  // removeAdminsWithoutChats();
  return null;
};
