import Link from "next/link";
import Image from "next/image";
import { getTranslations } from 'next-intl/server';

type Params = { params: { slug: string } };

const images: Record<string, string> = {
  tshirt: "/assets/tshirt.jpg",
  hoodie: "/assets/hoodie.jpeg",
  mug: "/assets/products/mug.svg",
  mask: "/assets/products/mask.svg",
  casquette: "/assets/casquetterrouge.jpg",
  "hoodie-noir": "/assets/hoodienoir.jpg",
};

export default async function ProductPage({ params }: Params) {
  const t = await getTranslations('product');
  const tProducts = await getTranslations('products');
  const image = images[params.slug] || images["tshirt"];
  const keyMap: Record<string, string> = {
    tshirt: 'teeShort',
    'tee-short': 'teeShort',
    'tee-long': 'teeLong',
    hoodie: 'hoodie',
    'hoodie-noir': 'hoodie',
    casquette: 'truckerCap',
    mug: 'mug',
    mask: 'mask'
  };
  const nameKey = keyMap[params.slug] || params.slug;
  const knownKeys = ['mug','mask','hoodie','crewneck','teeShort','teeLong','teeShortKid','truckerCap'] as const;
  const name = (knownKeys as readonly string[]).includes(nameKey) ? tProducts(nameKey as any) : params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return (
    <div className="container-page grid md:grid-cols-2 gap-10 py-10">
      <div className="card overflow-hidden relative aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{t('title', { name })}</h1>
        <p className="text-slate-600 mt-2">{t('description', { name })}</p>
        <Link
          href={`/personnaliser/${params.slug}`}
          className="btn-primary mt-6 inline-flex"
        >
          {tProducts('customize')}
        </Link>
      </div>
    </div>
  );
}
