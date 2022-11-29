import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const firstWorkspaceId = randomUUID();
  const firstClassId = randomUUID();

  await prisma.workspace.upsert({
    where: {
      id: firstWorkspaceId,
    },
    create: {
      id: firstWorkspaceId,
      name: 'First workspace',
      description: 'Workspace seeded using prisma/seed.ts',
    },
    update: {},
  });

  await prisma.class.upsert({
    where: {
      id: firstClassId,
    },
    create: {
      id: randomUUID(),
      workspaceId: firstWorkspaceId,
      name: 'Test',
      description: 'Cat is a domestic species of small carnivorous mammal',
      properties: {
        createMany: {
          data: [
            {
              id: randomUUID(),
              name: 'Name',
              type: 'String',
              description: 'The name of the cat',
            },
            {
              id: randomUUID(),
              name: 'Age',
              type: 'Integer',
              description: 'Age of the cat',
            },
            {
              id: randomUUID(),
              name: 'Breed',
              type: 'String',
              description: "The cat's breed",
            },
          ],
        },
      },
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
