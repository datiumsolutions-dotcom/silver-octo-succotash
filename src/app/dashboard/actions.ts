"use server";

import { redirect } from "next/navigation";

import { setCurrentOrganization } from "@/server/profile/setCurrentOrganization";
import { createServerSupabaseClient } from "@/server/supabase/server";

export async function logoutAction(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function changeCurrentOrganizationAction(formData: FormData): Promise<void> {
  const organizationId = formData.get("organizationId");
  if (typeof organizationId !== "string" || organizationId.trim().length === 0) {
    redirect("/dashboard?error=Seleccion%C3%A1%20una%20organizaci%C3%B3n.");
  }

  try {
    await setCurrentOrganization(organizationId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos cambiar la organización activa.";
    redirect(`/dashboard?error=${encodeURIComponent(message)}`);
  }

  redirect("/dashboard");
}
