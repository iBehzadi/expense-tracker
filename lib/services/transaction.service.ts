import { prisma } from "../prisma";
type UserTransactionParams = {
  userId: number;
  count?: number;
};

//دریافت تراکنش های کاربر
export async function getUserTransactions({
  userId,
  count,
}: UserTransactionParams) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: count,
    include: {
      category: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });
}

//دریافت تراکنش های ورودی 
export async function getUserInputTransations() {
    
}