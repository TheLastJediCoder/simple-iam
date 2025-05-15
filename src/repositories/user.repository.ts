import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const createUser = async (user: Prisma.UserCreateInput): Promise<User> => {
  return await prisma.user.create({ data: user });
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { email: email } });
};

const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      usersRoles: {
        include: { roles: true },
      },
    },
  });
};

const updateUser = async (
  userId: string,
  userData: Prisma.UserUpdateInput,
): Promise<User> => {
  return await prisma.user.update({ where: { id: userId }, data: userData });
};

const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

const deleteUser = async (userId: string): Promise<User> => {
  return await prisma.user.delete({ where: { id: userId } });
};

export const userRepository = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getUsers,
  deleteUser,
};
