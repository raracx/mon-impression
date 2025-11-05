"use client";
import { useEffect, useState } from 'react';

type Order = {
  id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  design_url?: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const json = await res.json();
    setOrders(json.orders || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const setStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchOrders();
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">Admin — Commandes</h1>
      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Client</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Design</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="p-3" colSpan={6}>Chargement…</td></tr>
            )}
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-3">{o.email}</td>
                <td className="p-3">{(o.amount/100).toFixed(2)} {o.currency.toUpperCase()}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.design_url ? <a href={o.design_url} target="_blank" className="text-slate-900 underline">Télécharger</a> : '-'}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={()=>setStatus(o.id,'fulfilled')}>Marquer livré</button>
                    <button className="btn-primary" onClick={()=>setStatus(o.id,'failed')}>Annuler</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


