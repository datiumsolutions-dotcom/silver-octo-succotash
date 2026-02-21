"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/server/supabase/server";

function getRequiredString(formData: FormData, key: "email" | "password"): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export async function registerAction(formData: FormData): Promise<void> {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!email || !password) {
    redirect("/register?error=Complet%C3%A1%20email%20y%20password.");
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Cuenta%20creada.%20Ahora%20pod%C3%A9s%20iniciar%20sesi%C3%B3n.");
}
