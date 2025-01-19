import { Prisma, PrismaClient, Scope } from '@prisma/client';

const prisma = new PrismaClient();

const createScope = async (scope: Prisma.ScopeCreateInput): Promise<Scope> => {
  return await prisma.scope.create({ data: scope });
};

const getScopeById = async (scopeId: string): Promise<Scope | null> => {
  return await prisma.scope.findUnique({ where: { id: scopeId } });
};

export const scopeRepository = { createScope, getScopeById };
