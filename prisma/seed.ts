import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firstClassId = '5c03994c-fc16-47e0-bd02-d218a370a078';
  await prisma.class.upsert({
    where: {
      id: firstClassId,
    },
    create: {
      id: firstClassId,
      name: 'Cat',
      description: 'Cat is a domestic species of small carnivorous mammal',
      properties: {
        createMany: {
          data: [
            {
              id: '1',
              name: 'Name',
              type: 'String',
              description: 'The name of the cat',
            },
            {
              id: '2',
              name: 'Age',
              type: 'Integer',
              description: 'Age of the cat',
            },
            {
              id: '3',
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
