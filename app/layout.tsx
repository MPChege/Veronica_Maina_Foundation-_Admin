"use client";
import "./globals.css";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard, FolderKanban, HardHat, HeartHandshake,
  ArrowLeft, Menu, Leaf, LogOut,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif", display: "swap", weight: ["300", "400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/contractors", label: "Contractors", icon: HardHat },
  { href: "/donations", label: "Donations", icon: HeartHandshake },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("vmf_admin_auth");
    router.replace("/login");
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ width: 260, background: "#0b1422", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.13)", border: "1.5px solid rgba(201,168,76,0.3)" }}>
              <Leaf className="w-5 h-5" style={{ color: "#C9A84C" }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>VMF Admin</p>
              <p className="text-white/30 text-[10px] tracking-widest uppercase mt-0.5" style={{ fontFamily: "var(--font-ui)" }}>Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-white/20 text-[9px] tracking-[0.25em] uppercase font-bold mb-4" style={{ fontFamily: "var(--font-ui)" }}>
            Navigation
          </p>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? path === href : path?.startsWith(href);
            return (
              <Link key={href} href={href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? "text-brand-dark"
                    : "text-white/50 hover:text-white hover:bg-white/06"
                }`}
                style={{
                  fontFamily: "var(--font-ui)",
                  background: active ? "#C9A84C" : undefined,
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-5 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/60 text-sm font-medium transition-all hover:bg-white/05"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            Back to Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/08 text-sm font-medium transition-all"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isLogin = path === "/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen flex" style={{ background: "#f1f5f9" }}>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" style={{ color: "#C9A84C" }} />
            <p className="font-black text-gray-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>VMF Admin</p>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <title>VMF Admin — Veronica Maina Foundation</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body suppressHydrationWarning>
        <AuthGuard>
          <AdminShell>
            {children}
          </AdminShell>
        </AuthGuard>
      </body>
    </html>
  );
}
