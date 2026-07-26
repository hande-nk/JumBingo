import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mb-3">
            <div className="h-5 w-5 rounded-sm border-2 border-emerald-400" />
          </div>
          <h1 className="text-xl font-bold">Jumbingo</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in with your Tufts email to play</p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs text-gray-400">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jumbo.elephant@tufts.edu"
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs text-gray-400">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            formAction={login}
            className="rounded-lg bg-emerald-500 text-black font-medium py-2 text-sm hover:bg-emerald-400 transition"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="rounded-lg border border-gray-700 text-gray-200 font-medium py-2 text-sm hover:border-gray-500 transition"
          >
            Sign up
          </button>
        </form>
      </div>
    </main>
  );
}