export const metadata = { title: "Tableau des tailles — monimpression" };
import { getTranslations } from "next-intl/server";

const rows = [
  { size: "XS", chest: "84-89 cm", length: "64 cm" },
  { size: "S", chest: "90-95 cm", length: "67 cm" },
  { size: "M", chest: "96-102 cm", length: "70 cm" },
  { size: "L", chest: "103-109 cm", length: "73 cm" },
  { size: "XL", chest: "110-118 cm", length: "76 cm" },
  { size: "2XL", chest: "119-127 cm", length: "79 cm" },
];

export default async function SizesPage() {
  const t = await getTranslations('sizes');
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">{t('title')}</h1>
      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">{t('headers.size')}</th>
              <th className="p-3">{t('headers.chest')}</th>
              <th className="p-3">{t('headers.length')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-t">
                <td className="p-3">{r.size}</td>
                <td className="p-3">{r.chest}</td>
                <td className="p-3">{r.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-600 text-sm mt-3">{t('footnote')}</p>
    </div>
  );
}
