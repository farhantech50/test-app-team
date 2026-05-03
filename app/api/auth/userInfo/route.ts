import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await requireUser();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    if (all === "true") {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: "asc" },
      });
      return Response.json(users);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    return Response.json(user);
  } catch (err) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
