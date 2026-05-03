import MembersClient from "@/components/MembersClient";
import { prisma } from "@/lib/prisma";
import { use } from "react";

export default async function MembersSlot({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const members = await prisma.teamMember.findMany({
    where: { teamId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return <MembersClient initialMembers={members} teamId={teamId} />;
}
