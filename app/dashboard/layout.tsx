import DashboardNavbar from "@/components/ui/DashboardNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <DashboardNavbar />
      {children}
    </main>
  );
}
