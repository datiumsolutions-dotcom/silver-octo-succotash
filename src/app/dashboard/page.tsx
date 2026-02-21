import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/server/supabase/server";

import { logoutAction } from "./actions";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6">
      <div className="w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">Sesión activa como: {user.email ?? "sin email"}</p>

        <form action={logoutAction} className="mt-6">
          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800" type="submit">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
