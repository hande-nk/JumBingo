import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main style={{ maxWidth: 320, margin: "80px auto", display: "grid", gap: 12 }}>
      <h1>Sign in to JumBINGO</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form style={{ display: "grid", gap: 8 }}>
        <label htmlFor="email">Tufts email</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
    </main>
  );
}