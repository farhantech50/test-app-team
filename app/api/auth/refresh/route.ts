import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signAccessToken, verifyRefreshToken } from "@/lib/token";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenInDb) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    const newAccessToken = signAccessToken(decoded.userId);

    (await cookieStore).set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return Response.json({ message: "Token refreshed" });
  } catch {
    return Response.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
