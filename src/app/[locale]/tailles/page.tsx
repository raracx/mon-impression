export const metadata = { title: "Informations sur les tailles — Mon Impression" };
import { getTranslations } from "next-intl/server";

export default async function SizesPage() {
  const t = await getTranslations('sizes');
  return (
    <div className="container-page py-10">
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-semibold mb-6">Information sur les tailles</h1>
          <p className="text-brand-gray-dark text-lg leading-relaxed">{t('footnote')}</p>
        </div>
      </div>
    </div>
  );
}
