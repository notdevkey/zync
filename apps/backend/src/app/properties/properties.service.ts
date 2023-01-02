import { Injectable } from '@nestjs/common';
import { Prisma, Property } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async getPropertiesByClassId(
    propertyWhereInput: Prisma.PropertyWhereInput,
  ): Promise<Property[]> {
    return this.prisma.property.findMany({ where: propertyWhereInput });
  }

  async getPropertyById(
    propertyWhereUniqueInput: Prisma.PropertyWhereUniqueInput,
  ): Promise<Property | null> {
    return this.prisma.property.findUnique({ where: propertyWhereUniqueInput });
  }

  async createProperty(data: Prisma.PropertyCreateInput): Promise<Property> {
    return this.prisma.property.create({ data });
  }

  async deleteProperty(
    propertyWhereUniqueInput: Prisma.PropertyWhereUniqueInput,
  ): Promise<Property> {
    return this.prisma.property.delete({ where: propertyWhereUniqueInput });
  }
}
