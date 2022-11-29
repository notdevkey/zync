import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Workspace } from '@prisma/client';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async allUserWorkspaces(): Promise<Workspace[]> {
    // TODO: make this user-specific
    return this.workspacesService.getAllWorkspaces();
  }

  @Get(':id')
  async workspaceById(
    @Param('id') workspaceId: string,
  ): Promise<Workspace | null> {
    return this.workspacesService.getWorkspaceById({ id: workspaceId });
  }

  @Get(':id/classes')
  async allWorkspaceClasses(@Param('id') workspaceId: string) {
    return this.workspacesService.getAllWorkspaceClasses({ id: workspaceId });
  }

  @Post()
  async newWorkspace(
    @Body()
    workspaceData: {
      name: string;
      description?: string;
    },
  ): Promise<Workspace> {
    return this.workspacesService.createWorkspace(workspaceData);
  }

  @Delete(':id')
  async deleteWorkspace(@Param('id') workspaceId: string) {
    return this.workspacesService.deleteWorkspace({ id: workspaceId });
  }
}
