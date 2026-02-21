import "server-only";

import type { Session } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getAuthCookieName(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  const hostname = new URL(url).hostname;
  const projectRef = hostname.split(".")[0];
  return `sb-${projectRef}-auth-token`;
}

/** Elimina la cookie de auth (logout). */
export function clearAuthCookie(): void {
  const cookieStore = cookies();
  const cookieName = getAuthCookieName();
  cookieStore.delete(cookieName);
}

/** Persiste la sesión en cookie para que rls.ts la lea en requests siguientes. */
export function setAuthCookie(session: Session): void {
  const cookieStore = cookies();
  const cookieName = getAuthCookieName();
  const accessToken = session.access_token;
  const expiresAt = session.expires_at;

  cookieStore.set(cookieName, encodeURIComponent(accessToken), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresAt ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000)) : 3600,
  });
}
