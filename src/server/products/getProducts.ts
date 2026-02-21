import "server-only";

import { getCurrentOrganization } from "@/server/profile/getCurrentOrganization";
import { createRlsServerSupabaseClient } from "@/server/supabase/rls";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  organizationId: string;
  createdAt: string;
};

export async function getProducts(): Promise<Product[]> {
  const currentOrganization = await getCurrentOrganization();
  if (!currentOrganization) {
    return [];
  }

  const rlsClient = await createRlsServerSupabaseClient();
  if (!rlsClient) {
    return [];
  }

  const { data, error } = await rlsClient.supabase
    .from("products")
    .select("id,name,description,price,organization_id,created_at")
    .eq("organization_id", currentOrganization.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load products: ${error.message}`);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: String(item.price),
    organizationId: item.organization_id,
    createdAt: item.created_at,
  }));
}
