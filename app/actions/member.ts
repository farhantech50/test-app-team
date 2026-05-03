"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addMembers(teamId: string, userIds: string[]) {
  await requireUser();

  if (!userIds || userIds.length === 0) {
    throw new Error("No users selected");
  }

  await prisma.teamMember.createMany({
    data: userIds.map((userId) => ({ userId, teamId })),
    skipDuplicates: true,
  });

  revalidatePath(`/teams/${teamId}`, "layout");
}
