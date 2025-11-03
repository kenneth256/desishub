/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `CANDIDATE` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `CANDIDATE` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CANDIDATE" ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CANDIDATE_phone_key" ON "CANDIDATE"("phone");
