import "server-only";

import { createServerSupabaseClient } from "@/server/supabase/server";

type CreateOrganizationInput = {
  name: string;
  slug: string;
};

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createOrganization(input: CreateOrganizationInput): Promise<string> {
  const name = input.name.trim();
  const slug = normalizeSlug(input.slug);

  if (!name) {
    throw new Error("Organization name is required");
  }

  if (!slug) {
    throw new Error("Organization slug is required");
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("create_organization_with_owner", {
    p_name: name,
    p_slug: slug,
  });

  if (error) {
    throw new Error(`Unable to create organization: ${error.message}`);
  }

  if (typeof data !== "string") {
    throw new Error("Unexpected response while creating organization");
  }

  return data;
}
