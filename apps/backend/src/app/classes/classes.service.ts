import { Injectable } from '@nestjs/common';
import { Class, Prisma, Property } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async getAllClassProperties(
    propertyWhereInput: Prisma.PropertyWhereInput,
  ): Promise<Property[]> {
    return this.prisma.property.findMany({
      where: propertyWhereInput,
    });
  }

  async getClassById(
    classWhereUniqueInput: Prisma.ClassWhereUniqueInput,
  ): Promise<Class | null> {
    return this.prisma.class.findUnique({ where: classWhereUniqueInput });
  }

  async createClass(data: Prisma.ClassCreateInput): Promise<Class> {
    return this.prisma.class.create({ data });
  }

  async updateClass(data: Prisma.ClassUpdateInput): Promise<Class> {
    return this.prisma.class.update({
      where: { id: data.id?.toString() },
      data: { ...data },
    });
  }

  async deleteClass(
    classWhereUniqueInput: Prisma.ClassWhereUniqueInput,
  ): Promise<Class> {
    return this.prisma.class.delete({ where: classWhereUniqueInput });
  }
}
