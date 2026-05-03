import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/teams - get all teams
export async function GET() {
  try {
    await requireUser();

    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(teams);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/teams - create a team
export async function POST(req: Request) {
  try {
    const userId = await requireUser();
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
