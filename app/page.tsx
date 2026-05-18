"use client";
import Link from "next/link";
import { FolderKanban, HardHat, HeartHandshake, Users, ChevronRight, TrendingUp } from "lucide-react";

const stats = [
  { label: "Active Projects", value: "12", sub: "+2 this month", icon: FolderKanban, color: "#1a6b2f", bg: "#e8f5ed" },
  { label: "Contractors", value: "8", sub: "3 currently on-site", icon: HardHat, color: "#1B2A4A", bg: "#e8edf5" },
  { label: "Total Donors", value: "247", sub: "+18 this month", icon: HeartHandshake, color: "#C9A84C", bg: "#faf3e0" },
  { label: "Beneficiaries", value: "3,400+", sub: "Across all programs", icon: Users, color: "#0e7490", bg: "#e0f2fe" },
];

const recentProjects = [
  { title: "Priscah Housing Project", category: "Housing", location: "Kiharu", status: "completed" },
  { title: "Iraki Family Home", category: "Housing", location: "Kandara", status: "completed" },
  { title: "Murang'a Medical Camp", category: "Health", location: "Murang'a Town", status: "ongoing" },
  { title: "VMF Supercup 2025", category: "Sports", location: "Murang'a Stadium", status: "completed" },
  { title: "December Food Drive", category: "Food", location: "County-wide", status: "ongoing" },
];

const recentDonations = [
  { donor: "Jane Wanjiku", amount: "KES 50,000", type: "Cash", date: "May 14" },
  { donor: "Community Church Murang'a", amount: "Food Hampers ×120", type: "In-Kind", date: "May 10" },
  { donor: "Anonymous", amount: "KES 25,000", type: "Cash", date: "May 8" },
  { donor: "Tech4Africa Ltd", amount: "KES 100,000", type: "Cash", date: "Apr 30" },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  ongoing:   { bg: "#dcfce7", color: "#15803d" },
  completed: { bg: "#dbeafe", color: "#1d4ed8" },
  planned:   { bg: "#fef9c3", color: "#854d0e" },
};

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>Welcome back</p>
        <h1 className="text-3xl font-black text-slate-900 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={1.75} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-200" />
            </div>
            <p className="text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            <p className="text-slate-500 text-sm font-semibold mt-1" style={{ fontFamily: "var(--font-ui)" }}>{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "var(--font-ui)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base" style={{ fontFamily: "var(--font-display)" }}>Recent Projects</h2>
            <Link href="/projects" className="text-xs text-brand-green font-semibold flex items-center gap-1 hover:text-brand-gold transition-colors" style={{ fontFamily: "var(--font-ui)" }}>
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentProjects.map((p) => (
              <div key={p.title} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate" style={{ fontFamily: "var(--font-ui)" }}>{p.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "var(--font-ui)" }}>{p.category} · {p.location}</p>
                </div>
                <span className="flex-shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-full capitalize"
                  style={{ background: statusStyle[p.status].bg, color: statusStyle[p.status].color }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base" style={{ fontFamily: "var(--font-display)" }}>Recent Donations</h2>
            <Link href="/donations" className="text-xs text-brand-green font-semibold flex items-center gap-1 hover:text-brand-gold transition-colors" style={{ fontFamily: "var(--font-ui)" }}>
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentDonations.map((d) => (
              <div key={d.donor + d.date} className="flex items-center gap-3 px-6 py-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs text-white"
                  style={{ background: "#1a6b2f", fontFamily: "var(--font-ui)" }}>
                  {d.donor === "Anonymous" ? "?" : d.donor.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate" style={{ fontFamily: "var(--font-ui)" }}>{d.donor}</p>
                  <p className="text-brand-green text-xs font-bold mt-0.5" style={{ fontFamily: "var(--font-ui)" }}>{d.amount}</p>
                </div>
                <p className="text-slate-400 text-xs flex-shrink-0" style={{ fontFamily: "var(--font-ui)" }}>{d.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { label: "Add New Project", href: "/projects", color: "#1a6b2f", bg: "#e8f5ed" },
          { label: "Add Contractor", href: "/contractors", color: "#1B2A4A", bg: "#e8edf5" },
          { label: "Record Donation", href: "/donations", color: "#C9A84C", bg: "#faf3e0" },
        ].map((a) => (
          <Link key={a.label} href={a.href}
            className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <p className="font-semibold text-sm" style={{ color: a.color, fontFamily: "var(--font-ui)" }}>{a.label}</p>
            <div className="w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: a.bg }}>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: a.color }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
