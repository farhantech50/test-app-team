"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProject(
  teamId: string,
  data: { name: string; description?: string },
) {
  await requireUser();

  if (!data.name) {
    throw new Error("Name is required");
  }

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      teamId,
    },
  });

  revalidatePath(`/teams/${teamId}`); // invalidates the team page cache
  return project;
}
