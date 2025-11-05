export const metadata = { title: 'FAQ — Custom Buzz' };

const faqs = [
  { q: 'Combien de temps pour produire un t-shirt ?', a: 'La plupart des petites commandes sont prêtes en 5 à 15 minutes en boutique. En ligne, prévoyez 1-3 jours ouvrables selon la charge.' },
  { q: 'Quels formats d’images acceptez-vous ?', a: 'PNG/JPG recommandés. Pour les logos, un SVG ou PNG haute résolution donnera le meilleur résultat.' },
  { q: 'Puis-je imprimer devant/derrière ?', a: 'Oui. Notre outil vous laisse choisir la zone d’impression et positionner votre design.' },
  { q: 'Offrez-vous des rabais de volume ?', a: 'Oui, contactez-nous via la page Soumission pour un prix sur mesure.' },
];

export default function FAQPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">FAQ</h1>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="card p-5">
            <div className="font-medium">{f.q}</div>
            <div className="text-slate-600 mt-2">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


