"use server";

import { redirect } from "next/navigation";

import { createProduct } from "@/server/products/createProduct";

function getStringField(formData: FormData, key: "name" | "description" | "price"): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createProductAction(formData: FormData): Promise<void> {
  const name = getStringField(formData, "name");
  const descriptionValue = getStringField(formData, "description");
  const price = getStringField(formData, "price");

  try {
    await createProduct({
      name,
      description: descriptionValue.trim().length > 0 ? descriptionValue : null,
      price,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos crear el producto.";
    redirect(`/dashboard/products?error=${encodeURIComponent(message)}`);
  }

  redirect("/dashboard/products");
}
