import { redirect } from "next/navigation";

import { getUserOrganizations } from "@/server/organizations/getUserOrganizations";
import { createOrganizationAction } from "./actions";

import { createServerSupabaseClient } from "@/server/supabase/server";

type OnboardingPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const organizations = await getUserOrganizations();
  if (organizations.length > 0) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold">Onboarding</h1>
        <p className="mt-2 text-sm text-gray-600">Creá tu primera organización para continuar.</p>

        {searchParams?.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
        ) : null}

        <form action={createOrganizationAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <button className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white" type="submit">
            Crear organización
          </button>
        </form>
      </div>
    </main>
  );
}
