/*
  Warnings:

  - Added the required column `description` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('String', 'Integer', 'DateTime');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "description" VARCHAR(256) NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL;
