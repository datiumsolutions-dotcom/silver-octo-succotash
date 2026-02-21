import Link from "next/link";

import { registerAction } from "./actions";

type RegisterPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="mt-2 text-sm text-gray-600">Registrate con email y contraseña.</p>

        {searchParams?.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
        ) : null}

        <form action={registerAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          <button
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            type="submit"
          >
            Registrarme
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          ¿Ya tenés cuenta?{" "}
          <Link className="font-medium text-black underline" href="/login">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
