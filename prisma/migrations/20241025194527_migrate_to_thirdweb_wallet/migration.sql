/*
  Warnings:

  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "userAddress" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "userId",
ADD COLUMN     "userAddress" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "address" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User"("address") ON DELETE CASCADE ON UPDATE CASCADE;
