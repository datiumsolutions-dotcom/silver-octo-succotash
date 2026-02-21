import "server-only";

import { getCurrentOrganization } from "@/server/profile/getCurrentOrganization";
import { createRlsServerSupabaseClient } from "@/server/supabase/rls";

type CreateProductInput = {
  name: string;
  description: string | null;
  price: string;
};

function parsePrice(price: string): number {
  const normalized = price.trim().replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("El precio debe ser un número válido mayor o igual a 0.");
  }

  return Number(value.toFixed(2));
}

export async function createProduct(input: CreateProductInput): Promise<void> {
  const currentOrganization = await getCurrentOrganization();
  if (!currentOrganization) {
    throw new Error("No hay organización activa.");
  }

  const name = input.name.trim();
  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  const description = input.description && input.description.trim().length > 0 ? input.description.trim() : null;
  const price = parsePrice(input.price);

  const rlsClient = createRlsServerSupabaseClient();
  if (!rlsClient) {
    throw new Error("Sesión inválida.");
  }

  const { error } = await rlsClient.supabase.from("products").insert({
    organization_id: currentOrganization.id,
    name,
    description,
    price,
  });

  if (error) {
    throw new Error(`No pudimos crear el producto: ${error.message}`);
  }
}
