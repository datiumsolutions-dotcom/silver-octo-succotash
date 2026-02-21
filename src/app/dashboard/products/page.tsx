import { redirect } from "next/navigation";

import { getCurrentOrganization } from "@/server/profile/getCurrentOrganization";
import { getProducts } from "@/server/products/getProducts";

import { createProductAction } from "./actions";

type ProductsPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentOrganization = await getCurrentOrganization();
  if (!currentOrganization) {
    redirect("/onboarding");
  }

  const products = await getProducts();

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Productos</h1>
      <p className="mt-1 text-sm text-gray-600">
        Organización activa: {currentOrganization.name} ({currentOrganization.slug})
      </p>

      {searchParams?.error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
      ) : null}

      <section className="mt-6 rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-medium">Crear producto</h2>
        <form action={createProductAction} className="mt-4 space-y-3">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Descripción
            </label>
            <textarea id="description" name="description" rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
            Crear
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-medium">Lista de productos</h2>

        {products.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">Todavía no hay productos en esta organización.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {products.map((product) => (
              <li key={product.id} className="rounded-md border border-gray-200 p-3">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-sm text-gray-600">{product.description ?? "Sin descripción"}</p>
                <p className="mt-1 text-sm text-gray-700">${product.price}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
