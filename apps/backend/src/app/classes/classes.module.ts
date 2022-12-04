import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { PropertiesService } from '../properties/properties.service';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [],
  controllers: [ClassesController],
  providers: [ClassesService, PropertiesService, PrismaService],
})
export class ClassesModule {}
