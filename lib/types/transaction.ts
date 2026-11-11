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