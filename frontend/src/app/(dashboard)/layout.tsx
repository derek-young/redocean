import AppSidebar from "@/components/app-sidebar";
import Assistant from "@/components/Assistant";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppProviders from "@/context/AppProviders";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <AppProviders>
        <div className="w-full min-h-screen bg-background">
          <Header />
          <div className="flex">
            <AppSidebar />
            <main className="flex-1 px-16 py-8">{children}</main>
          </div>
        </div>
        <Assistant />
      </AppProviders>
    </ProtectedRoute>
  );
}
