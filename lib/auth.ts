import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/token";

export async function requireUser() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  const decoded = verifyAccessToken(token);

  if (!decoded?.userId) {
    throw new Error("UNAUTHORIZED");
  }

  return decoded.userId;
}
