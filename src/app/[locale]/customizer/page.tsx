"use client";
import { useState } from 'react';
import CustomizerCanvas from '@/components/CustomizerCanvas';
import { useRouter } from 'next/navigation';

export default function CustomizerPage() {
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [base, setBase] = useState('/assets/products/tshirt.svg');
  const router = useRouter();

  const checkout = async () => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: 'Produit personnalisé', amount: 2500, quantity: 1 }],
        designUrl: exportUrl,
      }),
    });
    const { url } = await res.json();
    router.push(url);
  };

  return (
    <div className="container-page py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Personnaliser</h1>
      <div className="flex gap-2">
        {[
          {label: 'T-shirt', img: '/assets/products/tshirt.svg'},
          {label: 'Hoodie', img: '/assets/products/hoodie.svg'},
          {label: 'Tasse', img: '/assets/products/mug.svg'},
        ].map(p => (
          <button key={p.label} className={`btn-primary ${base===p.img?'bg-slate-800':''}`} onClick={()=>setBase(p.img)}>{p.label}</button>
        ))}
      </div>
      <CustomizerCanvas baseImage={base} onExport={setExportUrl} />
      <div className="flex gap-3">
        <button className="btn-primary" onClick={checkout} disabled={!exportUrl}>Ajouter au panier (Stripe)</button>
        {!exportUrl && <span className="text-sm text-slate-600 self-center">Exportez d'abord votre design pour activer le paiement.</span>}
      </div>
    </div>
  );
}


