"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "auth" | "unauth">("checking");
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (path === "/login") {
      setStatus("auth");
      return;
    }
    const ok = sessionStorage.getItem("vmf_admin_auth") === "true";
    if (ok) {
      setStatus("auth");
    } else {
      router.replace("/login");
      setStatus("unauth");
    }
  }, [path, router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080f1c" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(201,168,76,0.12)", border: "1.5px solid rgba(201,168,76,0.3)" }}
          >
            <Leaf className="w-6 h-6 animate-pulse" style={{ color: "#C9A84C" }} />
          </div>
          <p className="text-white/30 text-sm" style={{ fontFamily: "var(--font-ui)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauth") return null;
  return <>{children}</>;
}
