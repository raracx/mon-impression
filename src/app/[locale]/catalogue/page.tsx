import Link from 'next/link';
import { GARMENTS, COLORS, SIZES, SHIPPING } from '@/data/catalog';

export const metadata = { title: 'Catalogue — monimpression' };

export default function CataloguePage() {
  return (
    <div className="container-page py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">Catalogue – Mon Impression</h1>
        <p className="text-slate-600 mt-2">Vêtements personnalisés unisexes – Adultes et enfants</p>
        <p className="text-slate-600 mt-2">Couleurs: {COLORS.join(' | ')}</p>
        <p className="text-slate-600">Tailles Adultes: {SIZES.adult} — Enfants: {SIZES.kids}</p>
        <p className="text-slate-600 mt-2">Procédé DTF par défaut. Sublimation et broderie sur demande.</p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GARMENTS.map((g) => (
          <article key={g.slug} className="card flex flex-col overflow-hidden">
            {g.image && (
              <div className="relative w-full aspect-[4/5] bg-white">
                <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 flex flex-col">
            <h2 className="font-semibold text-lg">{g.title}</h2>
            <p className="text-slate-600 text-sm mt-1">{g.description}</p>
            <ul className="mt-3 text-sm list-disc ml-5 text-slate-700">
              {g.prices.map(p => (<li key={p.label}><span className="font-medium">{p.price}</span> — {p.label}</li>))}
            </ul>
            {g.features.length>0 && (
              <ul className="mt-3 text-sm list-disc ml-5 text-slate-700">
                {g.features.map(f => (<li key={f}>{f}</li>))}
              </ul>
            )}
              <div className="mt-auto pt-4">
                {(() => {
                  const target = g.slug.includes('tee') ? 'tshirt' : g.slug.includes('hoodie') ? 'hoodie' : g.slug.includes('crewneck') ? 'tshirt' : 'tshirt';
                  const href = g.image ? `/personnaliser/${target}?img=${encodeURIComponent(g.image)}` : `/personnaliser/${target}`;
                  return <Link href={href} className="btn-primary">Personnaliser ce modèle</Link>;
                })()}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="section-title mb-2">Livraison et entretien</h2>
        <p className="text-slate-700 text-sm">Livraison: {SHIPPING.price} — Gratuite dès {SHIPPING.freeFrom} d’achat</p>
        <ul className="mt-2 text-sm list-disc ml-5 text-slate-700">
          {SHIPPING.care.map(c => (<li key={c}>{c}</li>))}
        </ul>
      </section>

      <div className="text-center">
        <Link href="/tasses" className="btn-primary">Voir la section Tasses & Gobelets</Link>
      </div>
    </div>
  );
}


