import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export default async function SuccessPage() {
  const t = await getTranslations('success');
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="text-brand-gray-dark mt-2">{t('description')}</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">{t('backHome')}</Link>
    </div>
  );
}
