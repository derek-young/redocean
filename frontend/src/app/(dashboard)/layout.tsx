import AppSidebar from "@/components/app-sidebar";
import Assistant from "@/components/Assistant";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen bg-background">
        <Header />
        <div className="flex">
          <AppSidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
      <Assistant />
    </ProtectedRoute>
  );
}
