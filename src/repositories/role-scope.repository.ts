import { PrismaClient, Role, Scope } from '@prisma/client';

const prisma = new PrismaClient();

const linkRoleToScopes = async (role: Role, scopes: Scope[]) => {
  return await prisma.roleScope.createMany({
    data: scopes.map((scope) => ({ roleId: role.id, scopeId: scope.id })),
  });
};

const unlinkRoleFromAllScopes = async (roleId: string) => {
  return await prisma.roleScope.deleteMany({
    where: { roleId },
  });
};

export const roleScopeRepository = {
  linkRoleToScopes,
  unlinkRoleFromAllScopes,
};
