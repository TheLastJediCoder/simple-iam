import { Prisma, PrismaClient, Role, Scope } from '@prisma/client';

const prisma = new PrismaClient();

const createRole = async (role: Prisma.RoleCreateInput): Promise<Role> => {
  return await prisma.role.create({ data: role });
};

const getRoleById = async (roleId: string): Promise<Role | null> => {
  return await prisma.role.findUnique({ where: { id: roleId } });
};

const getRoleByIdWithScopes = async (
  roleId: string,
): Promise<(Role & { scopes: Scope[] }) | null> => {
  const roleWithScopes = await prisma.role.findUnique({
    where: { id: roleId },
    include: { rolesScopes: { include: { scopes: true } } },
  });
  if (!roleWithScopes) {
    return null;
  }
  const scopes = roleWithScopes.rolesScopes.map((rs) => rs.scopes);
  return { ...roleWithScopes, scopes };
};

const getAllRoles = async (): Promise<Role[]> => {
  return await prisma.role.findMany();
};

const updateRole = async (
  roleId: string,
  role: Prisma.RoleUpdateInput,
): Promise<Role | null> => {
  return await prisma.role
    .update({ where: { id: roleId }, data: role })
    .catch(() => null);
};

const deleteRole = async (roleId: string): Promise<Role> => {
  return await prisma.role.delete({ where: { id: roleId } });
};

export const roleRepository = {
  createRole,
  getRoleById,
  getRoleByIdWithScopes,
  getAllRoles,
  updateRole,
  deleteRole,
};
