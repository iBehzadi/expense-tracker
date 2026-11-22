export type TransactionInput = {
  title: string;
  amount: string;
  accountId: number;
  categoryId: number;
  description?: string;
  date?: Date;
};
export type UserTransactionParams = {
  userId: number;
  accountId?: number;
  count?: number;
};


export type CreateTransactionParams = {
  userId: number;
  data: TransactionInput;
};

export type UpdateTransactionParams = {
  userId: number;
  transactionId: number;
  data: TransactionInput;
};

export type DeleteTransactionParams = {
  userId: number;
  transactionId: number;
};

export type GetTransactionsByTypeParams = {
  userId: number;
  type: "income" | "expense";
};