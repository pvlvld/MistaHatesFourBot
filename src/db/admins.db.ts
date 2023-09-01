import { AdminInputWithPerm, ChatInput } from './../types/prisma.types';
import { Prisma } from '@prisma/client';
import prisma from './prismaClient.db';

export const createAdminWithChat = async (
  adminWithPerm: AdminInputWithPerm,
  chat: ChatInput
) => {
  const { has_del_perm } = adminWithPerm;
  const admin = (({ has_del_perm, ...o }) => o)(adminWithPerm);

  try {
    return await prisma.adminToChat.create({
      data: {
        has_del_perm,
        chat: { connectOrCreate: { where: { id: chat.id }, create: chat } },
        admin: { connectOrCreate: { where: { id: admin.id }, create: admin } },
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const updateAdminWithChat = async (
  adminWithPerm: AdminInputWithPerm,
  chat: ChatInput,
  admin_id: bigint
) => {
  const { has_del_perm } = adminWithPerm;
  const admin = (({ has_del_perm, ...o }) => o)(adminWithPerm);

  try {
    await prisma.adminToChat.update({
      data: {
        has_del_perm,
        admin: { connectOrCreate: { where: { id: admin.id }, create: admin } },
        chat: { connectOrCreate: { where: { id: chat.id }, create: chat } },
      },
      where: { adminId_chatId: { adminId: admin_id, chatId: chat.id } },
    });
  } catch (e) {
    console.error(e);
    return {} as Required<Prisma.AdminToChatUncheckedUpdateInput>;
  }
};

export const upsertAdminWithChat = async (
  adminWithPerm: AdminInputWithPerm,
  chat: ChatInput
) => {
  try {
    const admin_to_chat = await prisma.adminToChat.findFirst({
      where: { chatId: chat.id, adminId: adminWithPerm.id },
    });

    if (!admin_to_chat) {
      await createAdminWithChat(adminWithPerm, chat);
    } else {
      await updateAdminWithChat(adminWithPerm, chat, admin_to_chat.adminId);
    }
  } catch (e) {
    console.error(e);
  }
};

export const getAdminChats = async (admin_id: bigint): Promise<ChatInput[]> => {
  return (
    await prisma.adminToChat.findMany({
      where: { adminId: admin_id },
      select: { chat: true },
    })
  ).map((chat) => chat.chat);
};

export const getAdminChatsWithPerm = async (
  admin_id: bigint
): Promise<ChatInput[]> => {
  return (
    await prisma.adminToChat.findMany({
      where: { adminId: admin_id, has_del_perm: true },
      select: { chat: true },
    })
  ).map((chat) => chat.chat);
};
