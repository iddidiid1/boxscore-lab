import type { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = Prisma.TransactionClient;

export function toSlugBase(value: string) {
  const normalized = value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? normalized : null;
}

type SlugModel = "team" | "player" | "event";

async function slugExists(client: PrismaClient | TransactionClient, model: SlugModel, slug: string) {
  if (model === "team") {
    const existing = await client.team.findUnique({ where: { slug }, select: { id: true } });
    return existing !== null;
  }

  if (model === "event") {
    const existing = await client.event.findUnique({ where: { slug }, select: { id: true } });
    return existing !== null;
  }

  const existing = await client.player.findUnique({ where: { slug }, select: { id: true } });
  return existing !== null;
}

export async function generateUniqueSlug(
  client: PrismaClient | TransactionClient,
  model: SlugModel,
  name: string,
  fallbackBase: string
) {
  const base = toSlugBase(name) ?? fallbackBase;

  for (let attempt = 1; attempt <= 100; attempt += 1) {
    const slug = attempt === 1 ? base : `${base}-${attempt}`;
    if (!(await slugExists(client, model, slug))) {
      return slug;
    }
  }

  throw new Error("Unable to generate unique slug");
}

