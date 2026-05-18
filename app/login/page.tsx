"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, Lock, Mail, AlertCircle } from "lucide-react";

const ADMIN_EMAIL = "admin@vmf.co.ke";
const ADMIN_PASSWORD = "VMF@Admin2026";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("vmf_admin_auth") === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("vmf_admin_auth", "true");
      router.replace("/");
    } else {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#080f1c" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(26,107,47,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Login card */}
      <div
        className="relative w-full max-w-md mx-4"
        style={{
          background: "rgba(14,24,41,0.92)",
          border: "1px solid rgba(201,168,76,0.18)",
          borderRadius: "28px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top gold bar */}
        <div
          className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
        />

        <div className="px-8 pt-10 pb-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(201,168,76,0.12)",
                border: "1.5px solid rgba(201,168,76,0.35)",
              }}
            >
              <Leaf className="w-7 h-7 text-brand-gold" strokeWidth={1.5} />
            </div>
            <h1
              className="text-white font-black text-2xl text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VMF Admin Panel
            </h1>
            <p
              className="text-white/35 text-sm mt-1.5 tracking-wider"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Veronica Maina Foundation
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@vmf.co.ke"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-ui)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-ui)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: loading ? "rgba(201,168,76,0.7)" : "#C9A84C",
                color: "#1C1917",
                fontFamily: "var(--font-ui)",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-8 rounded-2xl px-5 py-4"
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-ui)" }}
            >
              Demo Credentials
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/30 text-xs" style={{ fontFamily: "var(--font-ui)" }}>Email</span>
                <button
                  type="button"
                  onClick={() => setEmail(ADMIN_EMAIL)}
                  className="text-xs font-mono px-3 py-1 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {ADMIN_EMAIL}
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/30 text-xs" style={{ fontFamily: "var(--font-ui)" }}>Password</span>
                <button
                  type="button"
                  onClick={() => setPassword(ADMIN_PASSWORD)}
                  className="text-xs font-mono px-3 py-1 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {ADMIN_PASSWORD}
                </button>
              </div>
            </div>
            <p
              className="text-white/20 text-[10px] mt-3 text-center"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Click either value to auto-fill
            </p>
          </div>

          {/* Footer note */}
          <p
            className="text-center text-white/20 text-xs mt-6"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Authorized personnel only · Veronica Maina Foundation &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
