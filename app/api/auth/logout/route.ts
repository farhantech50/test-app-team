import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = cookies();

  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  try {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
    (await cookieStore).delete("accessToken");
    (await cookieStore).delete("refreshToken");

    return Response.json({ message: "Logged out successfully" });
  } catch (error) {
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
