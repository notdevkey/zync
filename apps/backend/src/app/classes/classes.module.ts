import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [],
  controllers: [ClassesController],
  providers: [ClassesService, PrismaService],
})
export class ClassesModule {}
