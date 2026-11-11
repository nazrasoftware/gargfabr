import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE, verifyToken } from "./session";

export async function isAdmin() {
  // Token expiry compares against the current time, so this must run per request.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifyToken(token);
}

/** Re-verify inside every admin Server Action; the proxy check is only optimistic. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "garg@2026";
}
