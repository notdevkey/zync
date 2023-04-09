import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Property, PropertyType } from '@prisma/client';
import { convertPropertyType } from '../../utils/convert-property-type';
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

  @Put(':id')
  async updateProperty(
    @Param('id') propertyId: string,
    @Body()
    propertyData: Partial<{
      name: string;
      description: string;
      type: PropertyType;
      isRequired: boolean;
    }>,
  ): Promise<Property | null> {
    if (propertyData.type) {
      return this.propertiesService.updateProperty({
        propertyTypeRelation: {
          update: convertPropertyType(propertyData.type),
        },
        id: propertyId,
      });
    }
    return this.propertiesService.updateProperty({
      ...propertyData,
      id: propertyId,
    });
  }

  @Delete(':id')
  async deleteProperty(@Param('id') propertyId: string): Promise<Property> {
    return this.propertiesService.deleteProperty({ id: propertyId });
  }
}
