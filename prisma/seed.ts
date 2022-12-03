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
              propertyType: 'String',
              description: 'The name of the cat',
              isRequired: true,
            },
            {
              id: randomUUID(),
              name: 'Age',
              propertyType: 'Integer',
              description: 'Age of the cat',
            },
            {
              id: randomUUID(),
              name: 'Breed',
              propertyType: 'String',
              description: "The cat's breed",
              isRequired: true,
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
