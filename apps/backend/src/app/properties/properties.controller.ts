import { Controller, Delete, Get, Param } from '@nestjs/common';
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

  @Delete(':id')
  async deleteProperty(@Param('id') propertyId: string): Promise<Property> {
    return this.propertiesService.deleteProperty({ id: propertyId });
  }
}
