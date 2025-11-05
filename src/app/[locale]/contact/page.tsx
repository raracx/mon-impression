"use client";
import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('Envoi…');
    const res = await fetch('/api/forms/contact', { method: 'POST', body: JSON.stringify(Object.fromEntries(form as any)), headers: { 'Content-Type': 'application/json' } });
    const json = await res.json();
    setStatus(json.ok ? 'Message envoyé ✔' : 'Une erreur est survenue');
    if (json.ok) e.currentTarget.reset();
  };

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Contactez-nous</h1>
        <p className="text-slate-600">7077 Blvd. Newman, LaSalle, QC H8N 1X1 — 438-299-6565 — custombuzz@gmail.com</p>
        <form className="card p-6 mt-6 space-y-4" onSubmit={submit}>
          <input name="name" required placeholder="Nom complet" className="border rounded-md px-3 py-2 w-full" />
          <input name="email" type="email" required placeholder="Email" className="border rounded-md px-3 py-2 w-full" />
          <textarea name="message" rows={5} required placeholder="Votre message" className="border rounded-md px-3 py-2 w-full" />
          <button className="btn-primary" type="submit">Envoyer</button>
          {status && <div className="text-sm text-slate-600">{status}</div>}
        </form>
      </div>
      <div className="card overflow-hidden">
        <iframe title="Map" src="https://www.google.com/maps?q=7077%20Blvd.%20Newman%20LaSalle%20QC%20H8N%201X1&output=embed" className="w-full h-[360px]" />
      </div>
    </div>
  );
}


