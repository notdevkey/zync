/*
  Warnings:

  - You are about to drop the column `propertyType` on the `Property` table. All the data in the column will be lost.
  - Added the required column `typeOrRelationId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('STRING', 'INTEGER', 'DATE_TIME', 'FOREIGN');

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "propertyType",
ADD COLUMN     "typeOrRelationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TypeOrRelation" (
    "id" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "name" VARCHAR(50),

    CONSTRAINT "TypeOrRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_typeOrRelationId_fkey" FOREIGN KEY ("typeOrRelationId") REFERENCES "TypeOrRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
