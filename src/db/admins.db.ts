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
  adminToChatId: number
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
      where: { id: adminToChatId },
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
      await updateAdminWithChat(adminWithPerm, chat, admin_to_chat.id);
    }
  } catch (e) {
    console.error(e);
  }
};

async function getChatAdmins(chat_id: bigint) {
  return (
    await prisma.adminToChat.findMany({
      where: { chatId: chat_id },
      select: { admin: true, has_del_perm: true },
    })
  ).map((admin) => ({
    id: admin.admin.id,
    name: admin.admin.name,
    username: admin.admin.username,
    has_del_perm: admin.has_del_perm,
  }));
}

export const getAdminChats = async (admin_id: bigint): Promise<ChatInput[]> => {
  try {
    return await prisma.$queryRaw`
    SELECT
      "Chat".id,
      "Chat".name,
      "Chat".username,
      "Chat".settings
    FROM
      "Chat"
    JOIN
      "AdminToChat" ON "Chat".id = "AdminToChat"."groupId"
    WHERE
      "AdminToChat"."adminId" = ${admin_id}
  `;
  } catch (e) {
    console.error(e);
    return [] as ChatInput[];
  }
};
