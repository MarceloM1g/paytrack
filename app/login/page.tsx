import { signIn } from "@/auth";

export default async function LoginPage() {

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          {/*           <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
            <span className="text-xl font-bold">✦</span>
          </div> */}

          <h1 className="text-3xl font-semibold tracking-tight">
            Bem-vindo de volta
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Entre na sua conta para continuar.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-white/5">
          <form
            action={async () => {
              "use server";

              await signIn("google", {
                redirectTo: "/dashboard",
              });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.51A9.74 9.74 0 0 0 12 21.5Z"
                  fill="#34A853"
                />
                <path
                  d="M6.54 13.6a5.86 5.86 0 0 1 0-3.74V7.35H3.3a9.5 9.5 0 0 0 0 8.76l3.24-2.51Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.83c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.93 14.63 2 12 2a9.74 9.74 0 0 0-8.7 5.35l3.24 2.51C7.31 7.55 9.46 5.83 12 5.83Z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </button>
          </form>
        </div>

        {/*        <p className="mt-8 text-center text-xs text-zinc-600">
          © 2026 · Todos os direitos reservados
        </p> */}
      </div>
    </main>
  );
}
