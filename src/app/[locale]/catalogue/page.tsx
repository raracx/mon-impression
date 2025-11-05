import Link from "next/link";
import { GARMENTS, COLORS, SIZES, SHIPPING } from "@/data/catalog";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = { title: "Catalogue — monimpression" };

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogue");
  const isFr = locale === 'fr';
  return (
    <div className="container-page py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">{t("title")}</h1>
        <p className="text-slate-600 mt-2">{t("subtitle")}</p>
        <p className="text-slate-600 mt-2">{t("colors", { colors: (isFr ? COLORS.fr : COLORS.en).join(" | ") })}</p>
        <p className="text-slate-600">{t("sizes", { adult: isFr ? SIZES.adultFr : SIZES.adultEn, kids: isFr ? SIZES.kidsFr : SIZES.kidsEn })}</p>
        <p className="text-slate-600 mt-2">{t("method")}</p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GARMENTS.map((g) => (
          <article key={g.slug} className="card flex flex-col overflow-hidden">
            {g.image && (
              <div className="relative w-full aspect-[4/5] bg-white">
                <img
                  src={g.image}
                  alt={isFr ? g.titleFr : g.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 flex flex-col">
              <h2 className="font-semibold text-lg">{isFr ? g.titleFr : g.titleEn}</h2>
              <p className="text-slate-600 text-sm mt-1">{isFr ? g.descriptionFr : g.descriptionEn}</p>
              <ul className="mt-3 text-sm list-disc ml-5 text-slate-700">
                {g.prices.map((p) => (
                  <li key={(isFr ? p.labelFr : p.labelEn)}>
                    <span className="font-medium">{p.price}</span> — {isFr ? p.labelFr : p.labelEn}
                  </li>
                ))}
              </ul>
              {(isFr ? g.featuresFr : g.featuresEn).length > 0 && (
                <ul className="mt-3 text-sm list-disc ml-5 text-slate-700">
                  {(isFr ? g.featuresFr : g.featuresEn).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-4">
                {(() => {
                  const target = g.slug.includes("tee")
                    ? "tshirt"
                    : g.slug.includes("hoodie")
                      ? "hoodie"
                      : g.slug.includes("crewneck")
                        ? "tshirt"
                        : "tshirt";
                  const href = g.image
                    ? `/personnaliser/${target}?img=${encodeURIComponent(g.image)}`
                    : `/personnaliser/${target}`;
                  return (
                    <Link href={href} className="btn-primary">
                      {t("customizeModel")}
                    </Link>
                  );
                })()}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="section-title mb-2">{t("shippingTitle")}</h2>
        <p className="text-slate-700 text-sm">{t("shippingPrice", { price: SHIPPING.price, freeFrom: SHIPPING.freeFrom })}</p>
        <ul className="mt-2 text-sm list-disc ml-5 text-slate-700">
          {(isFr ? SHIPPING.careFr : SHIPPING.careEn).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <Link href="/tasses" className="btn-primary">{t("mugsCta")}</Link>
      </div>
    </div>
  );
}
