import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

 const createUser = async (
  user: Prisma.UserCreateInput,
): Promise<User> => {
  return await prisma.user.create({ data: user });
};

 const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { email: email } });
};

const getUserById = async (userId: string): Promise<User | null> => {
  return await prisma.user.findUnique({where: {id: userId}})
}

export const userRepository = {createUser, getUserByEmail, getUserById}
