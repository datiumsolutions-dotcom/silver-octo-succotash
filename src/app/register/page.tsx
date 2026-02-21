import Link from "next/link";

import { registerAction } from "./actions";

type RegisterPageProps = {
  searchParams?: { error?: string };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold">Crear cuenta</h1>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <form action={registerAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium text-black underline dark:text-white">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
