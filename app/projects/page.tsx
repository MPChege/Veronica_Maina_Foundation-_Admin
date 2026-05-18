"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, X, CheckCircle, RefreshCw } from "lucide-react";

const API = "http://localhost:3000/api/projects";

type Project = {
  id: string;
  title: string;
  category: string;
  status: "ongoing" | "completed" | "planned";
  location: string;
  beneficiaries: number;
  description: string;
  startDate: string;
};

const CATEGORIES = ["Housing", "Health", "Food Drives", "Sports", "Education", "Other"];
const STATUSES: Project["status"][] = ["ongoing", "completed", "planned"];
const EMPTY: Omit<Project, "id"> = { title: "", category: "Housing", status: "ongoing", location: "", beneficiaries: 0, description: "", startDate: "" };

const statusStyle: Record<string, { bg: string; color: string }> = {
  ongoing:   { bg: "#dcfce7", color: "#15803d" },
  completed: { bg: "#dbeafe", color: "#1d4ed8" },
  planned:   { bg: "#fef9c3", color: "#854d0e" },
};

const categoryPage: Record<string, string> = {
  "Housing":    "/housing",
  "Health":     "/health",
  "Food Drives": "/food-drives",
  "Sports":     "/supercup",
  "Education":  "/programs",
  "Other":      "/programs",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)) &&
      (filterStatus === "all" || p.status === filterStatus);
  });

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, category: p.category, status: p.status, location: p.location, beneficiaries: p.beneficiaries, description: p.description, startDate: p.startDate });
    setModal("edit");
  };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.location.trim()) return;
    setSaving(true);
    try {
      if (modal === "add") {
        const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const created = await res.json();
        setProjects([created, ...projects]);
        showToast("Project added — now live on the website ✓");
      } else if (editing) {
        await fetch(`${API}/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setProjects(projects.map((p) => p.id === editing.id ? { ...editing, ...form } : p));
        showToast("Project updated ✓");
      }
      close();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project? It will be removed from the website.")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
    showToast("Deleted");
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl" style={{ fontFamily: "var(--font-ui)" }}>
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>Manage</p>
          <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Projects</h1>
          <p className="text-slate-400 text-xs mt-1" style={{ fontFamily: "var(--font-ui)" }}>
            Changes go live on the website instantly
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: "#1a6b2f", fontFamily: "var(--font-ui)" }}>
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-100"
            style={{ fontFamily: "var(--font-ui)" }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${filterStatus === s ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
              style={{ fontFamily: "var(--font-ui)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-slate-300 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>{p.category}</span>
                      <a href={`http://localhost:3000${categoryPage[p.category] || "/programs"}`} target="_blank" rel="noopener"
                        className="text-[10px] font-semibold text-brand-green underline" style={{ fontFamily: "var(--font-ui)" }}>
                        View page ↗
                      </a>
                    </div>
                    <h3 className="text-slate-900 font-bold text-base leading-snug mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{p.title}</h3>
                  </div>
                  <span className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize"
                    style={{ background: statusStyle[p.status].bg, color: statusStyle[p.status].color }}>
                    {p.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-serif)" }}>{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="text-xs text-slate-400">📍 {p.location}</span>
                  <span className="text-xs text-slate-400">👥 {p.beneficiaries.toLocaleString()}</span>
                  {p.startDate && <span className="text-xs text-slate-400">📅 {new Date(p.startDate).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}</span>}
                </div>
              </div>
              <div className="flex border-t border-slate-100">
                <button onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  style={{ fontFamily: "var(--font-ui)" }}>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <div className="w-px bg-slate-100" />
                <button onClick={() => del(p.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  style={{ fontFamily: "var(--font-ui)" }}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <p className="col-span-full text-center py-16 text-slate-400" style={{ fontFamily: "var(--font-ui)" }}>No projects found.</p>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                {modal === "add" ? "Add New Project" : "Edit Project"}
              </h2>
              <button onClick={close} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900"
                  style={{ fontFamily: "var(--font-ui)" }} placeholder="Project name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900 bg-white"
                    style={{ fontFamily: "var(--font-ui)" }}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: "var(--font-ui)" }}>
                    → appears on <span className="font-semibold">{categoryPage[form.category]}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900 bg-white"
                    style={{ fontFamily: "var(--font-ui)" }}>
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Location *</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="e.g. Kiharu" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Beneficiaries</label>
                  <input type="number" min={0} value={form.beneficiaries} onChange={(e) => setForm({ ...form, beneficiaries: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900 bg-white"
                  style={{ fontFamily: "var(--font-ui)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-slate-900 resize-none"
                  style={{ fontFamily: "var(--font-serif)" }} placeholder="Brief project description…" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={close} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                style={{ background: "#1a6b2f", fontFamily: "var(--font-ui)" }}>
                {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : (modal === "add" ? "Add Project" : "Save Changes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
