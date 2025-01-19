import { Prisma, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const createRole = async (role: Prisma.RoleCreateInput): Promise<Role> => {
  return await prisma.role.create({ data: role });
};

const getRoleById = async (roleId: string): Promise<Role | null> => {
  return await prisma.role.findUnique({ where: { id: roleId } });
};

export const roleRepository = { createRole, getRoleById };
