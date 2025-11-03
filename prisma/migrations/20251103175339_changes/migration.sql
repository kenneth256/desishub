/*
  Warnings:

  - Added the required column `tier` to the `CANDIDATE` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CANDIDATE" ADD COLUMN     "tier" TEXT NOT NULL;
