
import { prisma } from "@/lib/prisma";

export async function getUserAccounts(userId: number) {
  return prisma.account.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type CreateAccountInput = {
  name: string;
  type?: "BANK" | "CASH" | "SAVINGS" | "OTHER";
  initialBalance?: string;
};

export async function createUserAccount(
  userId: number,
  input: CreateAccountInput
) {
  return prisma.account.create({
    data: {
      name: input.name,
      type: input.type ?? "BANK",
      initialBalance: BigInt(input.initialBalance ?? "0"),
      userId,
    },
  });
}
