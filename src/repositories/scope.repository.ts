import { Prisma, PrismaClient, Scope } from '@prisma/client';

const prisma = new PrismaClient();

const createScope = async (scope: Prisma.ScopeCreateInput): Promise<Scope> => {
  return await prisma.scope.create({ data: scope });
};

const getScopeById = async (scopeId: string): Promise<Scope | null> => {
  return await prisma.scope.findUnique({ where: { id: scopeId } });
};

const getAllScopes = async (): Promise<Scope[]> => {
  return await prisma.scope.findMany();
};

const updateScope = async (
  scopeId: string,
  data: Prisma.ScopeUpdateInput,
): Promise<Scope> => {
  return await prisma.scope.update({
    where: { id: scopeId },
    data,
  });
};

const deleteScope = async (scopeId: string): Promise<Scope> => {
  return await prisma.scope.delete({
    where: { id: scopeId },
  });
};

export const scopeRepository = {
  createScope,
  getScopeById,
  getAllScopes,
  updateScope,
  deleteScope,
};
