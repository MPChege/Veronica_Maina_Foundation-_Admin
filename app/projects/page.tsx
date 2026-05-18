"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, CheckCircle } from "lucide-react";

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

const SEED: Project[] = [
  { id: "1", title: "Priscah Housing Project", category: "Housing", status: "completed", location: "Kiharu Constituency", beneficiaries: 6, description: "Rebuilt home for vulnerable grandmother Priscah and her family.", startDate: "2025-02-01" },
  { id: "2", title: "Iraki Family Home", category: "Housing", status: "completed", location: "Kandara Constituency", beneficiaries: 5, description: "New home built for the Iraki family after their house was destroyed by fire in 2025.", startDate: "2025-05-10" },
  { id: "3", title: "Murang'a Medical Camp", category: "Health", status: "ongoing", location: "Murang'a Town", beneficiaries: 400, description: "Free medical consultations, screenings, and treatment for community members.", startDate: "2025-11-01" },
  { id: "4", title: "VMF Supercup 2025", category: "Sports", status: "completed", location: "Murang'a Stadium", beneficiaries: 800, description: "Annual youth football tournament promoting talent and discipline across Murang'a.", startDate: "2025-08-15" },
  { id: "5", title: "December Food Drive", category: "Food", status: "ongoing", location: "County-wide", beneficiaries: 1200, description: "End-of-year food hamper distribution to vulnerable families across all constituencies.", startDate: "2025-12-01" },
  { id: "6", title: "KEWOSA Women's Skills Training", category: "Education", status: "planned", location: "Murang'a County", beneficiaries: 150, description: "Vocational training programme for women in Murang'a to build economic independence.", startDate: "2026-03-01" },
];

const CATEGORIES = ["Housing", "Health", "Food", "Sports", "Education", "Other"];
const STATUSES: Project["status"][] = ["ongoing", "completed", "planned"];
const EMPTY: Omit<Project, "id"> = { title: "", category: "Housing", status: "ongoing", location: "", beneficiaries: 0, description: "", startDate: "" };

const statusStyle: Record<string, { bg: string; color: string }> = {
  ongoing:   { bg: "#dcfce7", color: "#15803d" },
  completed: { bg: "#dbeafe", color: "#1d4ed8" },
  planned:   { bg: "#fef9c3", color: "#854d0e" },
};

function useStore() {
  const [items, setItems] = useState<Project[]>([]);
  useEffect(() => {
    const s = localStorage.getItem("vmf_projects");
    setItems(s ? JSON.parse(s) : SEED);
  }, []);
  const save = (next: Project[]) => { setItems(next); localStorage.setItem("vmf_projects", JSON.stringify(next)); };
  return { items, save };
}

export default function ProjectsPage() {
  const { items: projects, save } = useStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [toast, setToast] = useState("");

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)) &&
      (filterStatus === "all" || p.status === filterStatus);
  });

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2800); };
  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ title: p.title, category: p.category, status: p.status, location: p.location, beneficiaries: p.beneficiaries, description: p.description, startDate: p.startDate }); setModal("edit"); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    if (modal === "add") { save([{ ...form, id: Date.now().toString() }, ...projects]); showToast("Project added"); }
    else if (editing) { save(projects.map((p) => p.id === editing.id ? { ...editing, ...form } : p)); showToast("Project updated"); }
    close();
  };

  const del = (id: string) => { if (!confirm("Delete this project?")) return; save(projects.filter((p) => p.id !== id)); showToast("Deleted"); };

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl" style={{ fontFamily: "var(--font-ui)" }}>
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>Manage</p>
          <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Projects</h1>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: "#1a6b2f", fontFamily: "var(--font-ui)" }}>
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-200"
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

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>{p.category}</span>
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
        {filtered.length === 0 && (
          <p className="col-span-full text-center py-16 text-slate-400" style={{ fontFamily: "var(--font-ui)" }}>No projects found.</p>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                {modal === "add" ? "Add New Project" : "Edit Project"}
              </h2>
              <button onClick={close} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900"
                  style={{ fontFamily: "var(--font-ui)" }} placeholder="Project name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900 bg-white"
                    style={{ fontFamily: "var(--font-ui)" }}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900 bg-white"
                    style={{ fontFamily: "var(--font-ui)" }}>
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Location *</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="e.g. Kiharu" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Beneficiaries</label>
                  <input type="number" min={0} value={form.beneficiaries} onChange={(e) => setForm({ ...form, beneficiaries: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900 bg-white"
                  style={{ fontFamily: "var(--font-ui)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-slate-900 resize-none"
                  style={{ fontFamily: "var(--font-serif)" }} placeholder="Brief project description…" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={close}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                style={{ fontFamily: "var(--font-ui)" }}>Cancel</button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: "#1a6b2f", fontFamily: "var(--font-ui)" }}>
                {modal === "add" ? "Add Project" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
