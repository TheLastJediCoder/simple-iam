import { Prisma, PrismaClient, UserToken } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserToken = async (
  userToken: Prisma.UserTokenCreateInput,
): Promise<UserToken> => {
  return await prisma.userToken.create({ data: userToken });
};

export const getUserTokenByAccessToken = async (
  accessToken: string,
): Promise<UserToken | null> => {
  return await prisma.userToken.findFirst({
    where: { accessToken: accessToken },
  });
};

export const revokeUserToken = async (userToken: UserToken) => {
  return await prisma.userToken.update({
    where: { id: userToken.id },
    data: { ...userToken, isRevoked: true },
  });
};
