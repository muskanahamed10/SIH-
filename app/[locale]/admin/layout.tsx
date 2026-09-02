import { GovHeader } from "@/components/layout/gov-header";
import { AdminNav } from "@/components/layout/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      <GovHeader />
      <AdminNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Ministry of Statistics and Programme Implementation (MoSPI) • Government of India</p>
          <p className="mt-1 text-slate-400">National Statistical Systems Training Academy (NSSTA) • Admin & SME Portal</p>
        </div>
      </footer>
    </div>
  );
}
