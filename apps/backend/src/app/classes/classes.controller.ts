import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Class, Class as ClassModel, Property } from '@prisma/client';
import { PropertiesService } from '../properties/properties.service';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly propertiesService: PropertiesService,
  ) {}

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
      name: classData.name,
      description: classData.description,
      workspace: { connect: { id: classData.workspaceId } },
    });
  }

  @Post(':id/properties')
  async addProperty(
    @Param('id') classId: string,
    @Body()
    propertyData: {
      name: string;
      propertyType: string;
      isRequired: boolean;
      description?: string;
    },
  ): Promise<Property> {
    return this.propertiesService.createProperty({
      name: propertyData.name,
      propertyType: propertyData.propertyType,
      description: propertyData.description,
      isRequired: propertyData.isRequired,
      class: { connect: { id: classId } },
    });
  }

  @Delete(':id')
  async deleteClass(@Param('id') id: string): Promise<Class | null> {
    return this.classesService.deleteClass({ id });
  }
}
