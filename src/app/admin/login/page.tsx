import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="grid min-h-svh bg-cotton lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-indigo-deep lg:block">
        <video src="/media/needle.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep via-transparent to-transparent" />
        <p className="absolute bottom-10 left-10 max-w-sm font-serif text-3xl italic text-cotton">Every order is a woman&apos;s work, honoured.</p>
      </div>
      <div className="grid place-items-center px-6">
        <div className="w-full max-w-sm">
          <Logo />
          <h1 className="display-md mt-10">Admin</h1>
          <p className="mt-2 text-muted">Sign in to manage products, orders and stories.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
