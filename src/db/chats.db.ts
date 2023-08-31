import { Prisma } from '@prisma/client';
import prisma from './prismaClient.db';
import { AdminInputWithPerm, SettingsOnly } from '../types/prisma.types';

export const upsertChatWithAdmins = async (
  chat: Omit<Prisma.ChatCreateInput, 'admins | settings'>,
  settings: SettingsOnly,
  admins: AdminInputWithPerm[]
) => {
  if (await get(BigInt(chat.id))) {
    update(chat, settings, admins);
  } else {
    create(chat, settings, admins);
  }
};

export const create = async (
  chat: Omit<Prisma.ChatCreateInput, 'admins | settings'>,
  settings: SettingsOnly,
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
            where: { id: Number(admin.id) },
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
  chat: Omit<Prisma.ChatCreateInput, 'admins | settings'>,
  settings: SettingsOnly,
  admins: AdminInputWithPerm[]
) => {
  return await prisma.chat
    .update({
      where: { id: chat.id },
      data: {
        ...chat,
        settings: {
          create: settings,
        },
        admins: {
          connectOrCreate: [...admins].map((admin) => ({
            where: { id: Number(admin.id) },
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

export const getChatAdmins = async (id: bigint) => {
  return await prisma.chat
    .findUnique({ where: { id }, select: { admins: true } })
    .catch((e: any) => {
      console.error(e);
      return null;
    });
};

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
