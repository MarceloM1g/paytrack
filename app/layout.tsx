import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "PayTrack",
  description:
    "Controle pagamentos, acompanhe vencimentos e gerencie cobranças de forma simples e segura.",

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  appleWebApp: {
    capable: true,
    title: "PayTrack",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
