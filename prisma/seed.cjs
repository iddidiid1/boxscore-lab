const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultDivisions = [
  { name: "Division A", slug: "division-a", sortOrder: 10 },
  { name: "Division B", slug: "division-b", sortOrder: 20 },
  { name: "Division C", slug: "division-c", sortOrder: 30 },
  { name: "Division D", slug: "division-d", sortOrder: 40 }
];

async function main() {
  for (const division of defaultDivisions) {
    await prisma.division.upsert({
      where: { slug: division.slug },
      update: {
        name: division.name,
        sortOrder: division.sortOrder
      },
      create: division
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
