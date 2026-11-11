import "server-only";
import { prisma } from "@/lib/prisma";

type getCategoryParams = {
  userId: number;
  categoryId: number;
};

// ============================  get cateogry service  =========================
export async function getCategoryService({
  userId,
  categoryId,
}: getCategoryParams) {
  return prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });
}

type getCategoriesParams = {
  userId: number;
  select?: {
    id?: boolean;
    name?: boolean;
    type?: boolean;
  };
};
// get categories service
export async function getCategoriesService({
  userId,
  select,
}: getCategoriesParams) {
  return prisma.category.findMany({
    where: {
      userId,
    },
    select: select,
  });
}
