export type GetUserAccountsParams = {
  userId: number;
  isActive?: boolean;
};

export type AccountInput = {
  name: string;
  type?: "BANK" | "CASH" | "SAVINGS" | "OTHER";
  initialBalance?: string;
};
export type UpdateUserAccountParams = {
  id: number;
  userId: number;
  isActive: boolean;
  input: AccountInput;
};
export type CreateAccountParams = {
  userId: number;
  input: AccountInput;
};