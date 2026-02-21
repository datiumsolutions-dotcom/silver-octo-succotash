"use server";

import { redirect } from "next/navigation";

import { createAnonSupabaseClient } from "@/server/supabase/rls";
import { setAuthCookie } from "@/server/supabase/auth-server";

export async function registerAction(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/register?error=" + encodeURIComponent("Email y contraseña son requeridos."));
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    redirect("/register?error=" + encodeURIComponent("Email es requerido."));
  }

  if (password.length < 6) {
    redirect("/register?error=" + encodeURIComponent("La contraseña debe tener al menos 6 caracteres."));
  }

  const supabase = createAnonSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
  });

  if (error) {
    redirect("/register?error=" + encodeURIComponent("No se pudo crear la cuenta. Intentá de nuevo."));
  }

  if (!data.session) {
    redirect("/register?error=" + encodeURIComponent("No se pudo iniciar sesión. Intentá de nuevo."));
  }

  setAuthCookie(data.session);
  redirect("/dashboard");
}
