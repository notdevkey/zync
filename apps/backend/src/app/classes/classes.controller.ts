import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  Class,
  Class as ClassModel,
  Property,
  PropertyType,
} from '@prisma/client';
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
      propertyType: PropertyType;
      isRequired: boolean;
      description?: string;
    },
  ): Promise<Property> {
    const isPrimitiveType = Object.values(PropertyType).includes(
      propertyData.propertyType,
    );
    return this.propertiesService.createProperty({
      name: propertyData.name,
      propertyTypeRelation: {
        create: {
          // If property is of primitive type, add it to the type
          // if not, insert 'FOREIGN' as the type and name of the foreign class as name
          type: isPrimitiveType
            ? propertyData.propertyType
            : PropertyType.FOREIGN,
          name: !isPrimitiveType ? propertyData.propertyType : null,
        },
      },
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
