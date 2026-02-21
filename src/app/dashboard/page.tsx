import { redirect } from "next/navigation";

import { getUserOrganizations } from "@/server/organizations/getUserOrganizations";
import { ensureCurrentOrganization } from "@/server/profile/ensureCurrentOrganization";
import { createServerSupabaseClient } from "@/server/supabase/server";

import { changeCurrentOrganizationAction, logoutAction } from "./actions";

type DashboardPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const organizations = await getUserOrganizations();
  if (organizations.length === 0) {
    redirect("/onboarding");
  }

  const activeOrganization = await ensureCurrentOrganization();
  const currentOrganizationId = activeOrganization?.id ?? organizations[0].id;
  const currentOrganizationName = activeOrganization?.name ?? organizations[0].name;
  const currentOrganizationSlug = activeOrganization?.slug ?? organizations[0].slug;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6">
      <div className="w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">Usuario: {user.email ?? "sin email"}</p>
        <p className="mt-2 text-sm text-gray-700">
          Organización activa: {currentOrganizationName} ({currentOrganizationSlug})
        </p>

        {searchParams?.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
        ) : null}

        <form action={changeCurrentOrganizationAction} className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="organizationId">
              Cambiar organización
            </label>
            <select
              id="organizationId"
              name="organizationId"
              defaultValue={currentOrganizationId}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name} ({organization.slug})
                </option>
              ))}
            </select>
          </div>

          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white" type="submit">
            Cambiar
          </button>
        </form>

        <form action={logoutAction} className="mt-6">
          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white" type="submit">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
