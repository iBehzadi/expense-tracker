import "server-only";
import { prisma } from "@/lib/prisma";
import {
  CreateAccountParams,
  GetUserAccountParams,
  UpdateUserAccountParams,
} from "../types/account";

//get user accounts
export async function getUserAccounts({
  userId,
  isActive,
  select,
}: GetUserAccountParams) {
  return prisma.account.findMany({
    where: {
      userId,
      isActive: isActive,
    },
    select: select,
  });
}

// get user account
export async function getUserAccount({
  userId,
  accountId,
  isActive,
  select,
}: GetUserAccountParams) {
  return prisma.account.findFirst({
    where: { userId, isActive, id: accountId },
    select: select,
  });
}

//create user account
export async function createUserAccount({
  userId,
  input,
}: CreateAccountParams) {
  const { name, type = "BANK", initialBalance = "0" } = input;

  return prisma.account.create({
    data: {
      name,
      type,
      initialBalance: BigInt(initialBalance),
      userId,
    },
  });
}

//update user account
export async function updateUserAccount({
  id,
  userId,
  isActive,
  input,
}: UpdateUserAccountParams) {
  const { name, type, initialBalance } = input;

  return prisma.account.updateMany({
    where: {
      id,
      userId,
      isActive,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(initialBalance !== undefined && {
        initialBalance: BigInt(initialBalance),
      }),
    },
  });
}

// حذف حساب
export async function deleteAccount() {}
