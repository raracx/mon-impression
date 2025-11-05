import Reviews from "@/components/Reviews";
import FeaturesBar from "@/components/FeaturesBar";
import ProductCard, { type Product } from "@/components/ProductCard";
import { GARMENTS } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

const pick = (slug: string) => GARMENTS.find((g) => g.slug === slug);
const popularBase: Omit<Product, "name">[] = [
  {
    id: "hoodie",
    slug: "hoodie",
    price: 29.99,
    image: pick("hoodie")?.image || "/assets/products/hoodie.svg",
  },
  {
    id: "crewneck",
    slug: "crewneck",
    price: 27.99,
    image: pick("crewneck")?.image || "/assets/products/tshirt.svg",
  },
  {
    id: "tee-short",
    slug: "tee-short",
    price: 19.99,
    image: pick("tee-short")?.image || "/assets/products/tshirt.svg",
  },
  {
    id: "tee-long",
    slug: "tee-long",
    price: 21.99,
    image: pick("tee-long")?.image || "/assets/products/tshirt.svg",
  },
  {
    id: "tee-short-kid",
    slug: "tee-short-kid",
    price: 19.99,
    image: pick("tee-short-kid")?.image || "/assets/products/tshirt.svg",
  },
  {
    id: "trucker-cap",
    slug: "trucker-cap",
    price: 25.0,
    image: pick("trucker-cap")?.image || "/assets/casquetterrouge.jpg",
  },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tProducts = await getTranslations("products");

  return (
    <div>
      <section className="relative mt-0 overflow-hidden aspect-[16/7] md:aspect-[16/6]">
        <div className="absolute inset-0">
          {/* Video background from Pexels */}
          <video
            className="w-full h-full object-cover"
            src="https://www.pexels.com/download/video/8738549/"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        </div>
        <div className="container-page relative py-10 md:py-16 flex justify-end">
          <div className="glass rounded-3xl shadow-2xl max-w-xl w-full md:w-[560px] p-8 md:p-12 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              {t("hero.title")}
            </h2>
            <p className="mt-4 text-slate-800 text-lg leading-relaxed">
              {t("hero.subtitle1")}
            </p>
            <p className="mt-1 text-slate-800 text-lg leading-relaxed">
              {t("hero.subtitle2")}
            </p>
            <Link
              href="/product/tshirt/personnaliser"
              className="btn-primary mt-6 inline-flex pulse-glow"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </section>
      <FeaturesBar />

      <section className="container-page mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold gradient-text">
            {t("popularProducts")}
          </h2>
          <Link
            href="/catalogue"
            className="animated-underline text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-2"
          >
            {t("viewAll")}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularBase.map((p) => {
            const nameKey =
              p.id === "tee-short"
                ? "teeShort"
                : p.id === "tee-long"
                  ? "teeLong"
                  : p.id === "tee-short-kid"
                    ? "teeShortKid"
                    : p.id === "trucker-cap"
                      ? "truckerCap"
                      : p.id;
            const product: Product = {
              ...(p as any),
              name: tProducts(nameKey as any),
            };
            return (
              <ProductCard
                key={p.id}
                product={product}
                ctaLabel={tProducts("customize")}
              />
            );
          })}
        </div>
      </section>

      <section className="container-page grid md:grid-cols-2 gap-10 mt-14">
        <div>
          <h3 className="section-title">{t("section1.title")}</h3>
          <p className="mt-3 text-slate-600">{t("section1.description")}</p>
        </div>
        <div>
          <h3 className="section-title">{t("section2.title")}</h3>
          <p className="mt-3 text-slate-600">{t("section2.description")}</p>
          <div className="mt-4 card p-6 overflow-hidden grid place-items-center">
            <img
              src="/assets/proudly-canadian.svg"
              alt={t("section2.proudlyCanadian")}
              className="max-h-48 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="container-page grid md:grid-cols-2 gap-10 mt-14">
        <div className="card p-6">
          <h3 className="section-title mb-2">{t("whyChoose.title")}</h3>
          <ul className="list-disc ml-5 text-slate-600 space-y-2">
            <li>{t("whyChoose.reason1")}</li>
            <li>{t("whyChoose.reason2")}</li>
            <li>{t("whyChoose.reason3")}</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="section-title mb-2">{t("whyCustom.title")}</h3>
          <ul className="list-disc ml-5 text-slate-600 space-y-2">
            <li>{t("whyCustom.reason1")}</li>
            <li>{t("whyCustom.reason2")}</li>
            <li>{t("whyCustom.reason3")}</li>
          </ul>
        </div>
      </section>

      <section className="container-page mt-14">
        <div className="card p-6">
          <h3 className="section-title mb-2">{t("advantages.title")}</h3>
          <ul className="grid md:grid-cols-3 gap-3 text-slate-600">
            <li>{t("advantages.advantage1")}</li>
            <li>{t("advantages.advantage2")}</li>
            <li>{t("advantages.advantage3")}</li>
          </ul>
        </div>
      </section>

      <section className="container-page mt-10">
        <div className="flex items-center justify-center gap-4 opacity-80">
          <img
            src="/assets/proudly-canadian.svg"
            alt={t("section2.proudlyCanadian")}
            className="h-10"
          />
          <img
            src="/assets/image a mettre dans les blocs.svg"
            alt={t("features.quality")}
            className="h-10"
          />
        </div>
      </section>

      <Reviews />
    </div>
  );
}
