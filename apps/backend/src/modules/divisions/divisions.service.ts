import { prisma } from "../../shared/db/prisma.js";

export async function listDivisions() {
  return prisma.division.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true
    }
  });
}

