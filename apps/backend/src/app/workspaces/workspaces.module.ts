import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, PrismaService],
})
export class WorkspacesModule {}
