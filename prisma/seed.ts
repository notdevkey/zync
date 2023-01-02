import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const stringType: Prisma.TypeOrRelationCreateInput = {
  id: randomUUID(),
  type: 'STRING',
};

const integerType: Prisma.TypeOrRelationCreateInput = {
  id: randomUUID(),
  type: 'INTEGER',
};

const foreignType: Prisma.TypeOrRelationCreateInput = {
  id: randomUUID(),
  type: 'FOREIGN',
  name: 'Animal',
};

async function main() {
  const firstWorkspaceId = randomUUID();
  const firstClassId = randomUUID();
  const secondClassId = randomUUID();

  // Create all types of relations beforehand for reusability
  await prisma.typeOrRelation.upsert({
    where: { id: stringType.id! },
    create: stringType,
    update: {},
  });
  await prisma.typeOrRelation.upsert({
    where: { id: integerType.id! },
    create: integerType,
    update: {},
  });
  await prisma.typeOrRelation.upsert({
    where: { id: foreignType.id! },
    create: foreignType,
    update: {},
  });

  // Create the main workspace
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

  // Create classes
  await prisma.class.upsert({
    where: { id: firstClassId },
    create: {
      id: firstClassId,
      workspaceId: firstWorkspaceId,
      name: 'Animal',
      description: 'Basic animal class',
      properties: {
        createMany: {
          data: [
            {
              name: 'Name',
              isRequired: true,
              typeOrRelationId: stringType.id!,
              description: 'Name of the animal',
            },
          ],
        },
      },
    },
    update: {},
  });

  await prisma.class.upsert({
    where: {
      id: secondClassId,
    },
    create: {
      id: secondClassId,
      workspaceId: firstWorkspaceId,
      name: 'Cat',
      description: 'Cat is a domestic species of small carnivorous mammal',
      properties: {
        createMany: {
          data: [
            {
              id: randomUUID(),
              name: 'Name',
              description: 'The name of the cat',
              typeOrRelationId: stringType.id!,
              isRequired: true,
            },
            {
              id: randomUUID(),
              name: 'Age',
              typeOrRelationId: integerType.id!,
              description: 'Age of the cat',
            },
            {
              id: randomUUID(),
              name: 'Parent',
              description: "The cat's breed",
              typeOrRelationId: foreignType.id!,
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
