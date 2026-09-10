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
    <div className="w-full max-w-5xl mx-auto border border-[#333] rounded-2xl mt-4 px-6 py-6">
      <h1 className="text-[#eee] font-medium text-base">Olá, {user.name}</h1>
      <PaymentList />
    </div>
  );
}