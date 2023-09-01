import { ChatMemberAdministrator, ChatMemberOwner } from '@grammyjs/types';
import { AdminInputWithPerm } from '../types/prisma.types';

type DBAdminWithPerm = {
  has_del_perm: boolean;
  admin: {
    id: bigint;
    name: string;
    username: string | null;
  };
};

const AdminsTransformer = {
  APItoUsable: (
    admins: (ChatMemberOwner | ChatMemberAdministrator)[]
  ): AdminInputWithPerm[] => {
    return admins.map((admin) => ({
      id: BigInt(admin.user.id),
      name: `${admin.user.first_name} ${admin.user.last_name || ''}`.trim(),
      username: admin.user.username || null,
      has_del_perm: admin.status === 'creator' || admin.can_delete_messages,
    }));
  },
  DBtoUsable: (db_admins: DBAdminWithPerm[]): AdminInputWithPerm[] => {
    return db_admins.map((admin) => ({
      id: admin.admin.id,
      name: admin.admin.name,
      username: admin.admin.username,
      has_del_perm: admin.has_del_perm,
    }));
  },
};

export default AdminsTransformer;
