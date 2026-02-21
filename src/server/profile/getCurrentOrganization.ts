import "server-only";

import { createServerSupabaseClient } from "@/server/supabase/server";

export type CurrentOrganization = {
  id: string;
  name: string;
  slug: string;
};

export async function getCurrentOrganization(): Promise<CurrentOrganization | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Unable to load user: ${userError.message}`);
  }

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to load profile: ${profileError.message}`);
  }

  const organizationId = profile?.current_organization_id;
  if (typeof organizationId !== "string") {
    return null;
  }

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("id,name,slug")
    .eq("id", organizationId)
    .maybeSingle();

  if (organizationError) {
    throw new Error(`Unable to load organization: ${organizationError.message}`);
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
