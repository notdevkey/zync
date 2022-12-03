import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Property } from '@prisma/client';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get(':id')
  async propertyById(
    @Param('id') propertyId: string,
  ): Promise<Property | null> {
    return this.propertiesService.getPropertyById({ id: propertyId });
  }

  @Post()
  async newProperty(
    @Body()
    propertyData: {
      name: string;
      type: string;
      classId: string;
      isRequired: boolean;
      propertyType: string;
      description?: string;
    },
  ): Promise<Property> {
    return this.propertiesService.createProperty({
      ...propertyData,
      class: { connect: { id: propertyData.classId } },
    });
  }

  @Delete(':id')
  async deleteProperty(@Param('id') propertyId: string): Promise<Property> {
    return this.propertiesService.deleteProperty({ id: propertyId });
  }
}
