/*
  Warnings:

  - The required column `id` was added to the `auth_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "auth_tokens" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id");
