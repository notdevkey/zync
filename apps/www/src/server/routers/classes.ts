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
  });
