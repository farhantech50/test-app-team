"use server";

import { prisma } from "@/lib/prisma";

export async function removeMember({ memberId }: { memberId: string }) {
  await prisma.teamMember.delete({
    where: {
      id: memberId,
    },
  });
  return true;
}
