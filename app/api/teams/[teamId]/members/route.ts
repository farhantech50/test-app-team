import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    await requireUser();
    const { teamId } = await params;

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(members);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    await requireUser();
    const { teamId } = await params;
    const { userIds } = await req.json();

    if (!userIds || userIds.length === 0) {
      return NextResponse.json({ error: "No users selected" }, { status: 400 });
    }

    await prisma.teamMember.createMany({
      data: userIds.map((userId: string) => ({ userId, teamId })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Members added successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
