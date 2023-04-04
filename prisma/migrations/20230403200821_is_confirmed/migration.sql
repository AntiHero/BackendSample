/*
  Warnings:

  - You are about to drop the `AuthToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordRecovery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegistrationConfirmation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthToken" DROP CONSTRAINT "AuthToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordRecovery" DROP CONSTRAINT "PasswordRecovery_userId_fkey";

-- DropForeignKey
ALTER TABLE "RegistrationConfirmation" DROP CONSTRAINT "RegistrationConfirmation_userId_fkey";

-- DropTable
DROP TABLE "AuthToken";

-- DropTable
DROP TABLE "PasswordRecovery";

-- DropTable
DROP TABLE "RegistrationConfirmation";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_recovery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT,
    "exp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_recovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regisitration_confirmation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT,
    "exp" TIMESTAMP(3) NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regisitration_confirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_recovery_userId_key" ON "password_recovery"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "regisitration_confirmation_userId_key" ON "regisitration_confirmation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_userId_key" ON "auth_tokens"("userId");

-- AddForeignKey
ALTER TABLE "password_recovery" ADD CONSTRAINT "password_recovery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regisitration_confirmation" ADD CONSTRAINT "regisitration_confirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
