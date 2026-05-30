"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { createClient } from "@/lib/supabase/client";

interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  cost_usd_min: number;
  cost_usd_max: number;
  is_featured: boolean;
}

export default function AdminTreatmentsPage() {
  const [data, setData] = useState<Treatment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", category: "", cost_usd_min: 0, cost_usd_max: 0, is_featured: false });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("treatments").select("*").order("name").then(({ data: items }) => {
      if (items) setData(items as Treatment[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", slug: "", category: "", cost_usd_min: 0, cost_usd_max: 0, is_featured: false }); setModalOpen(true); };
  const openEdit = (item: Treatment) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, category: item.category, cost_usd_min: item.cost_usd_min || 0, cost_usd_max: item.cost_usd_max || 0, is_featured: item.is_featured || false });
    setModalOpen(true);
  };
  const handleDelete = async (item: Treatment) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    const supabase = createClient();
    await supabase.from("treatments").delete().eq("id", item.id);
    setData(data.filter((d) => d.id !== item.id));
  };
  const handleSave = async () => {
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      category: form.category,
      cost_usd_min: form.cost_usd_min,
      cost_usd_max: form.cost_usd_max,
      is_featured: form.is_featured,
    };
    if (editing) {
      await supabase.from("treatments").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("treatments").insert(payload);
    }
    const { data: items } = await supabase.from("treatments").select("*").order("name");
    if (items) setData(items as Treatment[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", className: "text-ink font-medium" },
    { key: "category", label: "Category", className: "text-shade-50" },
    { key: "cost_usd_min", label: "Min Cost", render: (t: Treatment) => `$${(t.cost_usd_min || 0).toLocaleString()}`, className: "text-shade-50" },
    { key: "cost_usd_max", label: "Max Cost", render: (t: Treatment) => `$${(t.cost_usd_max || 0).toLocaleString()}`, className: "text-shade-50" },
    { key: "is_featured", label: "Featured", render: (t: Treatment) => t.is_featured ? <CheckCircle2 size={18} className="text-ink" /> : <Circle size={18} className="text-shade-30" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Treatments</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Treatment</button>
      </div>
      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} searchPlaceholder="Search treatments..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Treatment" : "Add Treatment"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Treatment Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="auto-generated" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink">
                <option value="">Select...</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Cosmetic">Cosmetic</option>
                <option value="Dental">Dental</option>
                <option value="Fertility">Fertility</option>
                <option value="Oncology">Oncology</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Min Cost (USD)</label>
              <input type="number" value={form.cost_usd_min} onChange={(e) => setForm({ ...form, cost_usd_min: Number(e.target.value) })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Max Cost (USD)</label>
              <input type="number" value={form.cost_usd_max} onChange={(e) => setForm({ ...form, cost_usd_max: Number(e.target.value) })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-hairline-light" />
            <label htmlFor="featured" className="text-body-md text-shade-50">Featured treatment</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-hairline-light">
            <button onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
