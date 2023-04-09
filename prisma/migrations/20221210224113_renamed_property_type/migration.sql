/*
  Warnings:

  - Changed the type of `type` on the `TypeOrRelation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('STRING', 'INTEGER', 'DATE_TIME', 'FOREIGN');

-- AlterTable
ALTER TABLE "TypeOrRelation" DROP COLUMN "type",
ADD COLUMN     "type" "PropertyType" NOT NULL;

-- DropEnum
DROP TYPE "Type";
