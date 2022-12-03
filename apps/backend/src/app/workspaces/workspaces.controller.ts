import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Workspace } from '@prisma/client';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async allUserWorkspaces(
    @Query('name') workspaceName: string,
  ): Promise<Workspace[] | Workspace | null> {
    if (workspaceName) {
      return this.workspacesService.getWorkspaceByName({ name: workspaceName });
    }
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
    return this.workspacesService.getAllWorkspaceClasses({
      workspaceId,
    });
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
