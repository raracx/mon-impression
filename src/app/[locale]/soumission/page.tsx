"use client";
import { useState } from 'react';

export default function SoumissionPage() {
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('Envoi…');
    const res = await fetch('/api/forms/quote', { method: 'POST', body: JSON.stringify(Object.fromEntries(form as any)), headers: { 'Content-Type': 'application/json' } });
    const json = await res.json();
    setStatus(json.ok ? 'Soumission envoyée ✔' : 'Une erreur est survenue');
    if (json.ok) e.currentTarget.reset();
  };

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Demander une soumission</h1>
        <p className="text-slate-600">Donnez-nous quelques détails et nous vous répondrons rapidement avec un prix personnalisé.</p>
        <form className="card p-6 mt-6 space-y-4" onSubmit={submit}>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" required placeholder="Nom complet" className="border rounded-md px-3 py-2 w-full" />
            <input name="email" type="email" required placeholder="Email" className="border rounded-md px-3 py-2 w-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select name="product" className="border rounded-md px-3 py-2 w-full">
              <option value="T-shirt">T-shirt</option>
              <option value="Hoodie">Hoodie</option>
              <option value="Tasse">Tasse</option>
              <option value="Masque">Masque</option>
            </select>
            <input name="quantity" type="number" min={1} defaultValue={10} className="border rounded-md px-3 py-2 w-full" placeholder="Quantité" />
          </div>
          <textarea name="details" rows={5} placeholder="Détails du projet (couleurs, zones, délais, etc.)" className="border rounded-md px-3 py-2 w-full" />
          <button className="btn-primary" type="submit">Envoyer la demande</button>
          {status && <div className="text-sm text-slate-600">{status}</div>}
        </form>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-lg">Pourquoi demander une soumission ?</h2>
        <ul className="list-disc ml-5 text-slate-600 mt-2 space-y-2">
          <li>Prix de volume avantageux</li>
          <li>Aide de nos graphistes</li>
          <li>Délais confirmés par écrit</li>
        </ul>
      </div>
    </div>
  );
}


