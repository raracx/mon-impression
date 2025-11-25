"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SoumissionPage() {
  const t = useTranslations('quote');
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus(t('form.sending'));
    const res = await fetch("/api/forms/quote", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form as any)),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    setStatus(json.ok ? t('form.sent') : t('form.error'));
    if (json.ok) e.currentTarget.reset();
  };

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-4">{t('title')}</h1>
        <p className="text-brand-gray-dark">{t('subtitle')}</p>
        <form className="card p-6 mt-6 space-y-4" onSubmit={submit}>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              required
              placeholder={t('form.name')}
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t('form.email')}
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="product"
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              aria-label={t('form.product')}
            >
              <option value="">{t('form.selectProduct')}</option>
              <option value="tshirt-short">{t('products.tshirtShort')}</option>
              <option value="tshirt-long">{t('products.tshirtLong')}</option>
              <option value="hoodie">{t('products.hoodie')}</option>
              <option value="crewneck">{t('products.crewneck')}</option>
              <option value="cap">{t('products.cap')}</option>
              <option value="mug">{t('products.mug')}</option>
              <option value="bottle">{t('products.bottle')}</option>
              <option value="other">{t('products.other')}</option>
            </select>
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={10}
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              placeholder={t('form.quantity')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-dark mb-2">
              {t('form.technique')}
            </label>
            <select
              name="technique"
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              aria-label={t('form.technique')}
            >
              <option value="dtf">{t('techniques.dtf')}</option>
              <option value="sublimation">{t('techniques.sublimation')}</option>
              <option value="embroidery">{t('techniques.embroidery')}</option>
              <option value="vinyl">{t('techniques.vinyl')}</option>
              <option value="unsure">{t('techniques.unsure')}</option>
            </select>
          </div>
          <textarea
            name="details"
            rows={5}
            placeholder={t('form.message')}
            className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
          />
          <button className="btn-primary" type="submit">{t('form.submit')}</button>
          {status && <div className="text-sm text-brand-gray-dark">{status}</div>}
        </form>
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold text-lg">{t('why.title')}</h2>
          <ul className="list-disc ml-5 text-brand-gray-dark mt-2 space-y-2">
            <li>{t('why.benefit1')}</li>
            <li>{t('why.benefit2')}</li>
            <li>{t('why.benefit3')}</li>
          </ul>
        </div>
        <div className="card p-6 bg-navy-50 border-l-4 border-navy">
          <h2 className="font-semibold text-lg text-navy">{t('techniques.title')}</h2>
          <ul className="mt-3 space-y-3 text-brand-gray-dark text-sm">
            <li><strong>DTF</strong> — {t('techniques.dtfDesc')}</li>
            <li><strong>Sublimation</strong> — {t('techniques.sublimationDesc')}</li>
            <li><strong>Broderie</strong> — {t('techniques.embroideryDesc')}</li>
            <li><strong>Vinyle</strong> — {t('techniques.vinylDesc')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
