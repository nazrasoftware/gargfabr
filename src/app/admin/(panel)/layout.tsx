import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };
export const instant = false;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-svh bg-[#F3EFE7] text-indigo lg:grid lg:grid-cols-[248px_1fr]">
      <AdminNav />
      <main className="min-w-0 px-4 pb-20 pt-6 sm:px-8 lg:px-12 lg:pt-10">
        <Suspense fallback={<PanelSkeleton />}>
          <Guard>{children}</Guard>
        </Suspense>
      </main>
    </div>
  );
}

async function Guard({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return <>{children}</>;
}

function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 rounded-xl bg-indigo/10" />
      <div className="h-32 rounded-3xl bg-indigo/5" />
      <div className="h-64 rounded-3xl bg-indigo/5" />
    </div>
  );
}
