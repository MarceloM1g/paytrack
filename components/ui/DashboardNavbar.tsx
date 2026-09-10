"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

function getGoogleAvatarUrl(url: string) {
  if (!url.includes("googleusercontent.com")) {
    return url;
  }

  return url.replace(/=s\d+-c$/, "=s400-c");
}

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) {
    return null;
  }

  return (
    <nav className="border-b border-[#333] bg-[#111]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2">
        <h1 className="text-xl font-bold text-[#eee]">
          Pagamentos
        </h1>

        <div className="relative bg-[#1b1b1b] rounded-full">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full px-1 py-1 hover:bg-[#333]"
          >
            {session.user.image ? (
              <Image
                src={getGoogleAvatarUrl(session.user.image)}
                alt={session.user.name ?? "Usuário"}
                width={40}
                height={40}
                quality={100}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="font-medium color-[#eee]">{session.user.name}</span>

            <span className="text-[12px]">▼</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#333] bg-[#111] p-2 shadow-lg">
              <button
                onClick={() => signOut()}
                className="w-full rounded-lg px-3 py-2 text-left text-red-400 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
