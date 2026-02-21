"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/server/supabase/server";

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/login?error=" + encodeURIComponent("Email y contraseña son requeridos."));
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    redirect("/login?error=" + encodeURIComponent("Email es requerido."));
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent("Credenciales inválidas. Intentá de nuevo."));
  }

  if (!data.session) {
    redirect("/login?error=" + encodeURIComponent("No se pudo iniciar sesión. Intentá de nuevo."));
  }

  redirect("/dashboard");
}
