import { getTranslations } from "next-intl/server";

export const metadata = { title: "FAQ — monimpression" };

export default async function FAQPage() {
  const t = await getTranslations("faq");
  const ids = [
    "productionTime",
    "imageFormats",
    "frontBack",
    "volumeDiscounts",
  ] as const;

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="space-y-4">
        {ids.map((id) => (
          <div key={id} className="card p-5">
            <div className="font-medium">{t(`items.${id}.q`)}</div>
            <div className="text-slate-600 mt-2">{t(`items.${id}.a`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
