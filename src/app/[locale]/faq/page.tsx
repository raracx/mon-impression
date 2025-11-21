import { getTranslations } from "next-intl/server";

export const metadata = { title: "FAQ — Mon Impression" };

export default async function FAQPage() {
  const t = await getTranslations("faq");
  const ids = [
    "customizableProducts",
    "paymentConfirmation",
    "printingTypes",
    "productionTime",
    "quote",
  ] as const;

  return (
    <div className="container-page py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("title")}</h1>
      <div className="space-y-6">
        {ids.map((id) => (
          <div key={id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="font-semibold text-lg text-slate-900 mb-3">{t(`items.${id}.q`)}</div>
            <div className="text-slate-700 leading-relaxed">{t(`items.${id}.a`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
