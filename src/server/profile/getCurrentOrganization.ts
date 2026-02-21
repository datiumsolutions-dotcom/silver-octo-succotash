import "server-only";

import { createRlsServerSupabaseClient, getAuthenticatedUserId } from "@/server/supabase/rls";

export type CurrentOrganization = {
  id: string;
  name: string;
  slug: string;
};

export async function getCurrentOrganization(): Promise<CurrentOrganization | null> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return null;
  }

  const rlsClient = createRlsServerSupabaseClient();
  if (!rlsClient) {
    return null;
  }

  const { data: profile, error: profileError } = await rlsClient.supabase
    .from("profiles")
    .select("current_organization_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to load profile: ${profileError.message}`);
  }

  const organizationId = profile?.current_organization_id;
  if (typeof organizationId !== "string") {
    return null;
  }

  const { data: organization, error: organizationError } = await rlsClient.supabase
    .from("organizations")
    .select("id,name,slug")
    .eq("id", organizationId)
    .maybeSingle();

  if (organizationError) {
    throw new Error(`Unable to load current organization: ${organizationError.message}`);
  }

  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
  };
}
