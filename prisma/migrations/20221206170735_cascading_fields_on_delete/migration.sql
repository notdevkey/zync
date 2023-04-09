-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_classId_fkey";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
