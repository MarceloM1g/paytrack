import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import PaymentList from "@/components/PaymentList";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.upsert({
    where: {
      email: session.user.email,
    },
    update: {
      name: session.user.name ?? "",
      image: session.user.image,
    },
    create: {
      email: session.user.email,
      name: session.user.name ?? "",
      image: session.user.image,
    },
  });

  return (
    <div className="relative isolate min-h-screen bg-[#0a0a0a]">
      {/* Brilho sutil no topo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(239,68,68,0.08),transparent_70%)]"
      />

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">
              Home
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-[#f7f7f7]">
              Olá, {user.name?.split(" ")[0] || "usuário"}
              <span className="text-red-400">.</span>
            </h1>
          </div>
        </header>

        {/* Seção de pagamentos */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-white/80">Pagamentos</h2>
        </div>

        <PaymentList />
      </div>
    </div>
  );
}
