import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "./server";

export type RlsClientResult = {
  supabase: SupabaseClient;
  userId: string;
};

/** Cliente Supabase con sesión del usuario para queries con RLS. */
export async function createRlsServerSupabaseClient(): Promise<RlsClientResult | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { supabase, userId: user.id };
}

export async function getAuthenticatedUserId(): Promise<string | null> {
  const rlsClient = await createRlsServerSupabaseClient();
  return rlsClient?.userId ?? null;
}
