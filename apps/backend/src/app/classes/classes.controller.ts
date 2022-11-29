import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Class, Class as ClassModel, Property } from '@prisma/client';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get(':id')
  async classById(@Param('id') id: string): Promise<Class | null> {
    return this.classesService.getClassById({ id });
  }

  @Get(':id/properties')
  async allClassProperties(@Param('id') classId: string): Promise<Property[]> {
    return this.classesService.getAllClassProperties({ classId });
  }

  @Post()
  async newClass(
    @Body()
    classData: {
      name: string;
      workspaceId: string;
      description?: string;
    },
  ): Promise<ClassModel> {
    return this.classesService.createClass({
      ...classData,
      workspace: { connect: { id: classData.workspaceId } },
    });
  }

  @Delete(':id')
  async deleteClass(@Param('id') id: string): Promise<Class | null> {
    return this.classesService.deleteClass({ id });
  }
}
