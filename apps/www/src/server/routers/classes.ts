import { z } from 'zod';
import { createRouter } from '../create-router';
import { prisma } from '../prisma';

export const classRouter = createRouter()
  .query('all', {
    async resolve() {
      const classes = await prisma.class.findMany({
        include: { properties: true },
      });
      return classes;
    },
  })
  .query('byId', {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      const { id } = input;
      const _class = await prisma.class.findUnique({
        where: { id },
        include: { properties: true },
      });
      return _class;
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      description: z.string().optional(),
    }),
    async resolve({ input }) {
      const { name, description } = input;
      const _class = await prisma.class.create({
        data: { name, description: description ?? '' },
      });
      return _class;
    },
  })
  .mutation('addProperty', {
    input: z.object({
      name: z.string(),
      type: z.string(),
      description: z.string(),
      classId: z.string(),
    }),
    async resolve({ input }) {
      const { classId, type, description, name } = input;
      const property = await prisma.property.create({
        data: { name, type, description, classId },
      });
      return property;
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const _class = await prisma.class.delete({ where: { id } });
      return _class;
    },
  })
  .mutation('deleteProperty', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const property = await prisma.property.delete({ where: { id } });
      return property;
    },
  });
