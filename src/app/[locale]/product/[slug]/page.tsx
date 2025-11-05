import Link from 'next/link';
import Image from 'next/image';

type Params = { params: { slug: string } };

const images: Record<string, string> = {
  tshirt: '/assets/tshirt.jpg',
  hoodie: '/assets/hoodie.jpeg',
  mug: '/assets/products/mug.svg',
  mask: '/assets/products/mask.svg',
  casquette: '/assets/casquetterrouge.jpg',
  'hoodie-noir': '/assets/hoodienoir.jpg',
};

export default function ProductPage({ params }: Params) {
  const image = images[params.slug] || images['tshirt'];
  const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return (
    <div className="container-page grid md:grid-cols-2 gap-10 py-10">
      <div className="card overflow-hidden relative aspect-square">
        <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{name} personnalisé</h1>
        <p className="text-slate-600 mt-2">Créez votre {name} parfait avec notre outil de personnalisation. Téléversez vos images, ajoutez du texte et prévisualisez en temps réel.</p>
        <Link href={`/personnaliser/${params.slug}`} className="btn-primary mt-6 inline-flex">Personnaliser maintenant</Link>
      </div>
    </div>
  );
}


