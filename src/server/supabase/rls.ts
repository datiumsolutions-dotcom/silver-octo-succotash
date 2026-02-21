import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type EnvName = "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

function requireEnv(name: EnvName): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

/** Cliente anon para operaciones de auth (login, signup) en server actions. */
export function createAnonSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function readAccessTokenFromCookieValue(rawValue: string): string | null {
  const decodedValue = decodeURIComponent(rawValue);
  if (decodedValue.includes(".")) {
    const parts = decodedValue.split(".");
    if (parts.length === 3) {
      return decodedValue;
    }
  }

  try {
    const parsedValue: unknown = JSON.parse(decodedValue);

    if (Array.isArray(parsedValue) && typeof parsedValue[0] === "string") {
      return parsedValue[0];
    }

    if (
      parsedValue &&
      typeof parsedValue === "object" &&
      "access_token" in parsedValue &&
      typeof (parsedValue as Record<string, unknown>).access_token === "string"
    ) {
      return (parsedValue as Record<string, string>).access_token;
    }
  } catch {
    return null;
  }

  return null;
}

function getAccessTokenFromCookies(): string | null {
  const cookieStore = cookies().getAll();
  const authCookie = cookieStore.find(
    (cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"),
  );

  if (!authCookie) {
    return null;
  }

  return readAccessTokenFromCookieValue(authCookie.value);
}

export type RlsClientResult = {
  accessToken: string;
  supabase: SupabaseClient;
};

export function createRlsServerSupabaseClient(): RlsClientResult | null {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return { accessToken, supabase };
}

export async function getAuthenticatedUserId(): Promise<string | null> {
  const rlsClient = createRlsServerSupabaseClient();
  if (!rlsClient) {
    return null;
  }

  const { data, error } = await rlsClient.supabase.auth.getUser(rlsClient.accessToken);
  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}
