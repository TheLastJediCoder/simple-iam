import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (
  user: Prisma.UserCreateInput,
): Promise<User> => {
  return await prisma.user.create({ data: user });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { email: email } });
};
