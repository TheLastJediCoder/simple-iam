import { PrismaClient, Role, User } from '@prisma/client';

const prisma = new PrismaClient();

const linkUserToRoles = async (user: User, roles: Role[]) => {
  return await prisma.userRole.createMany({
    data: roles.map((role) => ({ userId: user.id, roleId: role.id })),
  });
};

export const userRoleRepository = { linkUserToRoles };
