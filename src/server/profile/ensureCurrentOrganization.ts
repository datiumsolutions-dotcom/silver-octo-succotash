import "server-only";

import { getUserOrganizations } from "@/server/organizations/getUserOrganizations";

import { getCurrentOrganization, type CurrentOrganization } from "./getCurrentOrganization";
import { setCurrentOrganization } from "./setCurrentOrganization";

export async function ensureCurrentOrganization(): Promise<CurrentOrganization | null> {
  const organizations = await getUserOrganizations();
  if (organizations.length === 0) {
    return null;
  }

  const currentOrganization = await getCurrentOrganization();
  if (currentOrganization) {
    return currentOrganization;
  }

  const firstOrganization = organizations[0];
  await setCurrentOrganization(firstOrganization.id);

  return {
    id: firstOrganization.id,
    name: firstOrganization.name,
    slug: firstOrganization.slug,
  };
}
