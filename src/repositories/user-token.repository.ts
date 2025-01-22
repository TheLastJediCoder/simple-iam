import { Prisma, PrismaClient, UserToken } from '@prisma/client';

const prisma = new PrismaClient();

const createUserToken = async (
  userToken: Prisma.UserTokenCreateInput,
): Promise<UserToken> => {
  return await prisma.userToken.create({ data: userToken });
};

const getUserTokenByAccessToken = async (
  accessToken: string,
): Promise<UserToken | null> => {
  return await prisma.userToken.findFirst({
    where: { accessToken: accessToken, isRevoked: false },
  });
};

const revokeUserToken = async (userToken: UserToken) => {
  return await prisma.userToken.update({
    where: { id: userToken.id },
    data: { ...userToken, isRevoked: true },
  });
};

const getUserTokenByRefreshToken = async (
  refreshToken: string,
): Promise<UserToken | null> => {
  return await prisma.userToken.findFirst({
    where: { refreshToken: refreshToken, isRevoked: false },
  });
};

const updateUserToken = async (userToken: UserToken) => {
  return await prisma.userToken.update({
    where: {id: userToken.id},
    data: userToken,
  })
}

export const userTokenRepository = {
  createUserToken, getUserTokenByAccessToken, revokeUserToken, getUserTokenByRefreshToken, updateUserToken
}
