/*
  Warnings:

  - Changed the type of `type` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "type",
ADD COLUMN     "type" VARCHAR(20) NOT NULL;

-- DropEnum
DROP TYPE "Type";
