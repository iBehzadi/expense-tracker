/*
  Warnings:

  - You are about to alter the column `limit` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.

*/
-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "limit" SET DATA TYPE DECIMAL(18,2);
