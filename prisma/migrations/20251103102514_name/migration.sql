/*
  Warnings:

  - You are about to drop the column `selectedOption` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `optionA` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionB` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionC` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionD` on the `Question` table. All the data in the column will be lost.
  - Added the required column `selectedAnswer` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `correctAnswer` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "selectedOption",
ADD COLUMN     "selectedAnswer" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "optionA",
DROP COLUMN "optionB",
DROP COLUMN "optionC",
DROP COLUMN "optionD",
DROP COLUMN "correctAnswer",
ADD COLUMN     "correctAnswer" BOOLEAN NOT NULL;
