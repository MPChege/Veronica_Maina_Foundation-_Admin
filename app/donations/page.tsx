"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, X, CheckCircle, Filter, RefreshCw } from "lucide-react";

const API = "http://localhost:3000/api/donations";

export type Donation = {
  id: string;
  donorName: string;
  donorOrg: string;
  amount: string;
  type: "Cash" | "Food" | "Clothing" | "Medical Supplies" | "Building Materials" | "Other";
  currency: "KES" | "USD" | "GBP" | "In-Kind";
  date: string;
  purpose: string;
  message: string;
  isAnonymous: boolean;
  phone?: string;
  status?: "pending" | "completed";
  mpesaReceipt?: string;
};

const TYPES: Donation["type"][] = ["Cash", "Food", "Clothing", "Medical Supplies", "Building Materials", "Other"];
const CURRENCIES: Donation["currency"][] = ["KES", "USD", "GBP", "In-Kind"];
const EMPTY: Omit<Donation, "id"> = {
  donorName: "", donorOrg: "", amount: "", type: "Cash", currency: "KES",
  date: new Date().toISOString().split("T")[0], purpose: "", message: "", isAnonymous: false, phone: "",
};

const typeColor: Record<string, string> = { Cash: "#15803d", Food: "#b45309", Clothing: "#7c3aed", "Medical Supplies": "#0e7490", "Building Materials": "#92400e", Other: "#475569" };
const typeBg: Record<string, string> = { Cash: "#dcfce7", Food: "#fef3c7", Clothing: "#ede9fe", "Medical Supplies": "#e0f2fe", "Building Materials": "#fef3c7", Other: "#f1f5f9" };

function displayAmount(d: Donation) {
  if (d.currency === "In-Kind") return `${d.type} (In-Kind)${d.amount ? ` ×${d.amount}` : ""}`;
  return `${d.currency} ${parseInt(d.amount || "0").toLocaleString()}`;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Donation, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch(API); setDonations(await res.json()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  const filtered = donations.filter((d) => {
    const q = search.toLowerCase();
    return (d.donorName.toLowerCase().includes(q) || d.purpose.toLowerCase().includes(q)) &&
      (filterType === "all" || d.type === filterType);
  });

  const totalKES = donations.filter((d) => d.currency === "KES" && d.amount).reduce((s, d) => s + parseInt(d.amount), 0);

  const handleSave = async () => {
    if (!form.donorName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const created = await res.json();
      setDonations([created, ...donations]);
      showToast("Donation recorded — visible on website ✓");
      setShowModal(false);
      setForm(EMPTY);
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this donation record?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setDonations(donations.filter((d) => d.id !== id));
    showToast("Deleted");
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl" style={{ fontFamily: "var(--font-ui)" }}>
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>Manage</p>
          <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Donations</h1>
          <p className="text-slate-400 text-xs mt-1" style={{ fontFamily: "var(--font-ui)" }}>Recorded donations appear on the public Donations page</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setForm(EMPTY); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: "#C9A84C", color: "#1C1917", fontFamily: "var(--font-ui)" }}>
            <Plus className="w-4 h-4" /> Record Donation
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-ui)" }}>Total Cash (KES)</p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "#1a6b2f" }}>KES {totalKES.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-ui)" }}>Total Records</p>
          <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{donations.length}</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-ui)" }}>Pending M-Pesa</p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: donations.filter((d) => d.status === "pending").length > 0 ? "#b45309" : "#94a3b8" }}>
            {donations.filter((d) => d.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search donor or purpose…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-100"
            style={{ fontFamily: "var(--font-ui)" }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterType("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${filterType === "all" ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
            style={{ fontFamily: "var(--font-ui)" }}>
            <Filter className="w-3.5 h-3.5" /> All
          </button>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${filterType === t ? "text-white" : "bg-white text-slate-500 border border-slate-200"}`}
              style={{ fontFamily: "var(--font-ui)", background: filterType === t ? typeColor[t] : undefined }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><RefreshCw className="w-6 h-6 text-slate-300 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Donor", "Amount", "Type", "Purpose", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs text-white"
                          style={{ background: d.isAnonymous ? "#94a3b8" : "#1a6b2f", fontFamily: "var(--font-ui)" }}>
                          {d.isAnonymous ? "?" : d.donorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800" style={{ fontFamily: "var(--font-ui)" }}>{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                          {d.phone && <p className="text-xs text-slate-400">{d.phone}</p>}
                          {d.donorOrg && <p className="text-xs text-slate-400">{d.donorOrg}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold" style={{ color: "#1a6b2f", fontFamily: "var(--font-ui)" }}>{displayAmount(d)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full"
                        style={{ background: typeBg[d.type], color: typeColor[d.type], fontFamily: "var(--font-ui)" }}>{d.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-xs" style={{ fontFamily: "var(--font-ui)" }}>{d.purpose || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {d.status === "pending" ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-600" style={{ fontFamily: "var(--font-ui)" }}>Pending</span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700" style={{ fontFamily: "var(--font-ui)" }}>
                          {d.mpesaReceipt ? `M-Pesa ${d.mpesaReceipt}` : "Completed"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-xs" style={{ fontFamily: "var(--font-ui)" }}>
                        {new Date(d.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => del(d.id)} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-16 text-slate-400" style={{ fontFamily: "var(--font-ui)" }}>No donations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-lg" style={{ fontFamily: "var(--font-display)" }}>Record a Donation</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <input id="anon" type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked, donorName: e.target.checked ? "Anonymous" : "" })} className="w-4 h-4" />
                <label htmlFor="anon" className="text-sm font-semibold text-slate-600 cursor-pointer" style={{ fontFamily: "var(--font-ui)" }}>Anonymous donation</label>
              </div>
              {!form.isAnonymous && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Donor Name *</label>
                    <input value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900"
                      style={{ fontFamily: "var(--font-ui)" }} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Phone</label>
                    <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900"
                      style={{ fontFamily: "var(--font-ui)" }} placeholder="+254 7XX XXX XXX" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Donation["type"] })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900 bg-white" style={{ fontFamily: "var(--font-ui)" }}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Currency</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Donation["currency"] })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900 bg-white" style={{ fontFamily: "var(--font-ui)" }}>
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Amount / Qty</label>
                  <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900 bg-white" style={{ fontFamily: "var(--font-ui)" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Purpose</label>
                <input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900"
                  style={{ fontFamily: "var(--font-ui)" }} placeholder="e.g. Housing Projects, Food Drive…" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Message</label>
                <textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-900 resize-none"
                  style={{ fontFamily: "var(--font-serif)" }} placeholder="Any message from the donor…" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "#C9A84C", color: "#1C1917", fontFamily: "var(--font-ui)" }}>
                {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : "Save Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
