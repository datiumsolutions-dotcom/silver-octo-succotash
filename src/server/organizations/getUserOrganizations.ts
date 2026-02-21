import "server-only";

import { createServerSupabaseClient } from "@/server/supabase/server";

export type UserOrganization = {
  id: string;
  name: string;
  slug: string;
};

function toUserOrganization(value: unknown): UserOrganization | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.slug === "string"
  ) {
    return {
      id: candidate.id,
      name: candidate.name,
      slug: candidate.slug,
    };
  }

  return null;
}

export async function getUserOrganizations(): Promise<UserOrganization[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("organization_members")
    .select("organizations(id,name,slug)")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load organizations: ${error.message}`);
  }

  const organizations: UserOrganization[] = [];
  for (const item of data ?? []) {
    const maybeOrganization = toUserOrganization(item.organizations);
    if (maybeOrganization) {
      organizations.push(maybeOrganization);
    }
  }

  return organizations;
}
