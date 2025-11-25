import Link from "next/link";
import Image from "next/image";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({
  product,
  ctaLabel,
}: {
  product: Product;
  ctaLabel?: string;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group card hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border-b-4 border-transparent hover:border-navy"
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-brand-gray-lighter to-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-brand-black group-hover:text-navy transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-brand-gray-dark group-hover:text-navy transition-colors font-medium">
            {ctaLabel ?? "Customize →"}
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-navy-dark to-navy bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
