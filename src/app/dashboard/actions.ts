"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/server/supabase/server";

export async function logoutAction(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
