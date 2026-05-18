"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, CheckCircle, Phone, Mail } from "lucide-react";

type Contractor = {
  id: string;
  name: string;
  company: string;
  specialty: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  assignedProject: string;
  location: string;
};

const SEED: Contractor[] = [
  { id: "1", name: "James Mwangi", company: "Mwangi & Sons Construction", specialty: "Residential Construction", phone: "+254 722 100 200", email: "james@mwangiconst.co.ke", status: "active", assignedProject: "Iraki Family Home", location: "Kandara" },
  { id: "2", name: "Peter Kamau", company: "Kamau Engineering Ltd", specialty: "Civil Engineering", phone: "+254 733 200 300", email: "pkamau@kamauen.co.ke", status: "active", assignedProject: "Priscah Housing Project", location: "Kiharu" },
  { id: "3", name: "Faith Nyambura", company: "FN Interiors", specialty: "Interior Finishing", phone: "+254 700 400 500", email: "faith@fninteriors.co.ke", status: "inactive", assignedProject: "", location: "Murang'a Town" },
  { id: "4", name: "Samuel Gitonga", company: "Gitonga Medical Supplies", specialty: "Medical Equipment & Supplies", phone: "+254 711 600 700", email: "sam@gitongamed.co.ke", status: "active", assignedProject: "Murang'a Medical Camp", location: "Murang'a Town" },
  { id: "5", name: "Grace Wanjiku", company: "GW Catering Services", specialty: "Food & Logistics", phone: "+254 744 800 900", email: "grace@gwcatering.co.ke", status: "active", assignedProject: "December Food Drive", location: "County-wide" },
];

const SPECIALTIES = ["Residential Construction", "Civil Engineering", "Interior Finishing", "Medical Equipment & Supplies", "Food & Logistics", "Electrical", "Plumbing", "Landscaping", "Transport & Logistics", "Other"];
const EMPTY: Omit<Contractor, "id"> = { name: "", company: "", specialty: "Residential Construction", phone: "", email: "", status: "active", assignedProject: "", location: "" };

function useStore() {
  const [items, setItems] = useState<Contractor[]>([]);
  useEffect(() => { const s = localStorage.getItem("vmf_contractors"); setItems(s ? JSON.parse(s) : SEED); }, []);
  const save = (next: Contractor[]) => { setItems(next); localStorage.setItem("vmf_contractors", JSON.stringify(next)); };
  return { items, save };
}

export default function ContractorsPage() {
  const { items: contractors, save } = useStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Contractor | null>(null);
  const [form, setForm] = useState<Omit<Contractor, "id">>(EMPTY);
  const [toast, setToast] = useState("");

  const filtered = contractors.filter((c) => {
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q)) &&
      (filterStatus === "all" || c.status === filterStatus);
  });

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2800); };
  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (c: Contractor) => { setEditing(c); setForm({ name: c.name, company: c.company, specialty: c.specialty, phone: c.phone, email: c.email, status: c.status, assignedProject: c.assignedProject, location: c.location }); setModal("edit"); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name.trim() || !form.company.trim()) return;
    if (modal === "add") { save([{ ...form, id: Date.now().toString() }, ...contractors]); showToast("Contractor added"); }
    else if (editing) { save(contractors.map((c) => c.id === editing.id ? { ...editing, ...form } : c)); showToast("Updated"); }
    close();
  };
  const del = (id: string) => { if (!confirm("Remove this contractor?")) return; save(contractors.filter((c) => c.id !== id)); showToast("Removed"); };

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
          <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Contractors</h1>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: "#1B2A4A", fontFamily: "var(--font-ui)" }}>
          <Plus className="w-4 h-4" /> Add Contractor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, company, or specialty…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
            style={{ fontFamily: "var(--font-ui)" }} />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${filterStatus === s ? "text-white" : "bg-white text-slate-500 border border-slate-200"}`}
              style={{ fontFamily: "var(--font-ui)", background: filterStatus === s ? "#1B2A4A" : undefined }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg text-white"
                  style={{ background: c.status === "active" ? "#1B2A4A" : "#94a3b8", fontFamily: "var(--font-display)" }}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-900 font-bold text-sm truncate" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h3>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <p className="text-slate-400 text-xs truncate" style={{ fontFamily: "var(--font-ui)" }}>{c.company}</p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 mb-3"
                style={{ fontFamily: "var(--font-ui)" }}>{c.specialty}</span>
              <div className="space-y-1.5">
                {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand-green transition-colors" style={{ fontFamily: "var(--font-ui)" }}><Phone className="w-3.5 h-3.5" />{c.phone}</a>}
                {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand-green transition-colors" style={{ fontFamily: "var(--font-ui)" }}><Mail className="w-3.5 h-3.5" />{c.email}</a>}
              </div>
              {c.assignedProject && (
                <div className="mt-3 px-3 py-2 rounded-lg" style={{ background: "#f0f7f2" }}>
                  <p className="text-xs font-semibold" style={{ color: "#1a6b2f", fontFamily: "var(--font-ui)" }}>📁 {c.assignedProject}</p>
                </div>
              )}
            </div>
            <div className="flex border-t border-slate-100">
              <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" style={{ fontFamily: "var(--font-ui)" }}>
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <div className="w-px bg-slate-100" />
              <button onClick={() => del(c.id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" style={{ fontFamily: "var(--font-ui)" }}>
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="col-span-full text-center py-16 text-slate-400" style={{ fontFamily: "var(--font-ui)" }}>No contractors found.</p>}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-lg" style={{ fontFamily: "var(--font-display)" }}>{modal === "add" ? "Add Contractor" : "Edit Contractor"}</h2>
              <button onClick={close} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="e.g. John Kamau" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Contractor["status"] })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900 bg-white"
                    style={{ fontFamily: "var(--font-ui)" }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Company / Business *</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                  style={{ fontFamily: "var(--font-ui)" }} placeholder="e.g. Kamau Construction Ltd" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Specialty</label>
                <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900 bg-white"
                  style={{ fontFamily: "var(--font-ui)" }}>
                  {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="+254 7XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="name@company.co.ke" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="Murang'a Town" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>Assigned Project</label>
                  <input value={form.assignedProject} onChange={(e) => setForm({ ...form, assignedProject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                    style={{ fontFamily: "var(--font-ui)" }} placeholder="Project name or leave blank" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={close} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors" style={{ fontFamily: "var(--font-ui)" }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity" style={{ background: "#1B2A4A", fontFamily: "var(--font-ui)" }}>
                {modal === "add" ? "Add Contractor" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
