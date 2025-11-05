import { MUGS } from '@/data/catalog';

const gallery = [
  '/Tasses%26goblets/IMG_7118.jpg',
  '/Tasses%26goblets/IMG_7121.jpg',
  '/Tasses%26goblets/IMG_7125.jpg',
  '/Tasses%26goblets/IMG_7126.jpg',
  '/Tasses%26goblets/IMG_7127.jpg',
  '/Tasses%26goblets/IMG_7130.jpg',
  '/Tasses%26goblets/IMG_7131.jpg',
  '/Tasses%26goblets/IMG_7132.jpg',
  '/Tasses%26goblets/86[1].png',
  '/Tasses%26goblets/88.png',
  '/Tasses%26goblets/91[1].png',
  '/Tasses%26goblets/Grande%20tasse%20isotherme%20(35).png',
  '/Tasses%26goblets/Grande%20tasse%20isotherme%20(36).png',
  '/Tasses%26goblets/Grande%20tasse%20isotherme%20(37).png',
];

export const metadata = { title: 'Tasses & Gobelets — monimpression' };

export default function TassesPage() {
  return (
    <div className="container-page py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">Tasses & Gobelets</h1>
        <p className="text-slate-600 mt-2">Les images sont à titre d’exemple; certaines variantes peuvent différer selon le fournisseur.</p>
      </header>

      <section className="card p-4 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {gallery.map((src) => (
            <img key={src} src={src} alt="Aperçu tasse" className="snap-start rounded-md h-56 w-auto object-cover" />
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MUGS.map(m => (
          <article key={m.slug} className="card p-6">
            <h2 className="font-semibold text-lg">{m.title}</h2>
            <p className="text-slate-600 text-sm mt-1">{m.description}</p>
            <ul className="mt-3 text-sm list-disc ml-5 text-slate-700">
              {m.bullets.map(b => (<li key={b}>{b}</li>))}
            </ul>
            <div className="mt-3 text-sm"><span className="font-semibold">Prix:</span> {m.price}</div>
          </article>
        ))}
      </section>
    </div>
  );
}


