import { Injectable } from '@nestjs/common';
import { Class, Prisma, Workspace } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async getAllWorkspaces(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany();
  }

  async getAllWorkspaceClasses(
    classWhereInput: Prisma.ClassWhereInput,
  ): Promise<Class[]> {
    return this.prisma.class.findMany({
      where: classWhereInput,
    });
  }

  async getWorkspaceById(
    workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput,
  ): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({
      where: workspaceWhereUniqueInput,
    });
  }

  async createWorkspace(data: Prisma.WorkspaceCreateInput): Promise<Workspace> {
    return this.prisma.workspace.create({ data });
  }

  async deleteWorkspace(
    workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput,
  ): Promise<Workspace> {
    return this.prisma.workspace.delete({ where: workspaceWhereUniqueInput });
  }
}
