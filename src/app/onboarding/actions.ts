"use server";

import { redirect } from "next/navigation";

import { createOrganization } from "@/server/organizations/createOrganization";
import { createServerSupabaseClient } from "@/server/supabase/server";

function getRequiredString(formData: FormData, key: "name" | "slug"): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function createOrganizationAction(formData: FormData): Promise<void> {
  const name = getRequiredString(formData, "name");
  const slug = getRequiredString(formData, "slug");

  if (!name || !slug) {
    redirect("/onboarding?error=Complet%C3%A1%20nombre%20y%20slug.");
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await createOrganization({ name, slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos crear la organización.";
    redirect(`/onboarding?error=${encodeURIComponent(message)}`);
  }

  redirect("/dashboard");
}
