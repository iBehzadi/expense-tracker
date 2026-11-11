import "server-only";
import { prisma } from "../prisma";

// get user base information
export async function getUserInfoService(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}
