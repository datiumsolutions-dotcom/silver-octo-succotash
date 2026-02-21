import "server-only";

import { createServerSupabaseClient } from "@/server/supabase/server";

export async function setCurrentOrganization(organizationId: string): Promise<string> {
  const normalizedOrganizationId = organizationId.trim();
  if (!normalizedOrganizationId) {
    throw new Error("Organization is required");
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("set_current_organization", {
    org_id: normalizedOrganizationId,
  });

  if (error) {
    throw new Error(`Unable to set current organization: ${error.message}`);
  }

  if (typeof data !== "string") {
    throw new Error("Unexpected response while setting current organization");
  }

  return data;
}
