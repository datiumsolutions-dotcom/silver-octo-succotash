import Link from "next/link";

import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>

        {searchParams?.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
        ) : null}

        {searchParams?.message ? (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{searchParams.message}</p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <button className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white" type="submit">
            Entrar
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="font-medium text-black underline">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
