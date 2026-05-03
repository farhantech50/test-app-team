import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/teams/[teamId]/members/[memberId]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string; memberId: string }> },
) {
  try {
    await requireUser();
    const { teamId, memberId } = await params;

    const member = await prisma.teamMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            tasks: {
              where: {
                project: {
                  teamId: teamId,
                },
              },
              select: {
                id: true,
                title: true,
                status: true,
                dueDate: true,
                project: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
