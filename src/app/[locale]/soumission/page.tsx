"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, X } from "lucide-react";

export default function SoumissionPage() {
  const t = useTranslations("quote");
  const tProducts = useTranslations("products");
  const [status, setStatus] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    // Add the uploaded file if it exists
    if (uploadedFile) {
      form.set("designFile", uploadedFile);
    }

    setStatus(t("form.sending"));

    // Convert FormData to JSON, handling the file separately
    const data: any = {};
    form.forEach((value, key) => {
      if (key !== "designFile") {
        data[key] = value;
      }
    });

    // If there's a file, convert it to base64
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        data.designFile = reader.result;
        data.fileName = uploadedFile.name;
        data.fileType = uploadedFile.type;

        const res = await fetch("/api/forms/quote", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        setStatus(json.ok ? t("form.sent") : t("form.error"));
        if (json.ok) {
          e.currentTarget.reset();
          setUploadedFile(null);
        }
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      const res = await fetch("/api/forms/quote", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      setStatus(json.ok ? t("form.sent") : t("form.error"));
      if (json.ok) e.currentTarget.reset();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Fichier trop volumineux. Maximum 5MB.");
        return;
      }
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-4">{t("title")}</h1>
        <p className="text-brand-gray-dark">{t("subtitle")}</p>
        <form className="card p-6 mt-6 space-y-4" onSubmit={submit}>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              required
              placeholder={t("form.name")}
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t("form.email")}
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="product"
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              aria-label={t("form.product")}
            >
              <option value="">{t("form.selectProduct")}</option>
              <optgroup label={tProducts("clothingCategory")}>
                <option value="tshirt-short">{tProducts("tshirt")}</option>
                <option value="tshirt-long">{tProducts("longsleeve")}</option>
                <option value="hoodie">{tProducts("hoodie")}</option>
                <option value="crewneck">{tProducts("crewneck")}</option>
              </optgroup>
              <optgroup label={tProducts("accessoriesCategory")}>
                <option value="cap">{tProducts("cap")}</option>
                <option value="mug-insulated">
                  {tProducts("mugInsulated")}
                </option>
                <option value="mug-frosted">{tProducts("mugFrosted")}</option>
                <option value="mug-magic">{tProducts("mugMagic")}</option>
                <option value="mug-ceramic">{tProducts("mugCeramic")}</option>
                <option value="mousepad">{tProducts("mousepad")}</option>
                <option value="shopping-bag">{tProducts("shoppingBag")}</option>
                <option value="drawstring-bag">
                  {tProducts("drawstringBag")}
                </option>
                <option value="license-plate">
                  {tProducts("licensePlate")}
                </option>
                <option value="suction-poster">
                  {tProducts("suctionPoster")}
                </option>
              </optgroup>
              <option value="other">{t("products.other")}</option>
            </select>
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={10}
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              placeholder={t("form.quantity")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-dark mb-2">
              {t("form.technique")}
            </label>
            <select
              name="technique"
              className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              aria-label={t("form.technique")}
            >
              <option value="dtf">{t("techniques.dtf")}</option>
              <option value="sublimation">{t("techniques.sublimation")}</option>
              <option value="embroidery">{t("techniques.embroidery")}</option>
              <option value="vinyl">{t("techniques.vinyl")}</option>
              <option value="unsure">{t("techniques.unsure")}</option>
            </select>
          </div>
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-gray-dark">
              {t("form.uploadImage")}{" "}
              <span className="text-xs text-brand-gray">(optionnel)</span>
            </label>
            <div className="relative">
              {!uploadedFile ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-gray-light rounded-lg cursor-pointer bg-white hover:bg-navy-50 hover:border-navy transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-brand-gray-dark" />
                    <p className="text-sm text-brand-gray-dark">
                      <span className="font-semibold">
                        Cliquez pour téléverser
                      </span>{" "}
                      ou glissez-déposez
                    </p>
                    <p className="text-xs text-brand-gray-dark mt-1">
                      PNG, JPG, PDF (max. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 border-2 border-navy rounded-lg bg-navy-50">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-navy" />
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-brand-gray-dark">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-navy/20 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-navy" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-brand-gray-dark italic">
              Téléversez votre logo, design ou image de référence
            </p>
          </div>

          <textarea
            name="details"
            rows={5}
            placeholder={t("form.message")}
            className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
          />
          <button className="btn-primary" type="submit">
            {t("form.submit")}
          </button>
          {status && (
            <div className="text-sm text-brand-gray-dark">{status}</div>
          )}
        </form>
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold text-lg">{t("why.title")}</h2>
          <ul className="list-disc ml-5 text-brand-gray-dark mt-2 space-y-2">
            <li>{t("why.benefit1")}</li>
            <li>{t("why.benefit2")}</li>
            <li>{t("why.benefit3")}</li>
          </ul>
        </div>
        <div className="card p-6 bg-navy-50 border-l-4 border-navy">
          <h2 className="font-semibold text-lg text-navy">
            {t("techniques.title")}
          </h2>
          <ul className="mt-3 space-y-3 text-brand-gray-dark text-sm">
            <li>
              <strong>DTF</strong> — {t("techniques.dtfDesc")}
            </li>
            <li>
              <strong>Sublimation</strong> — {t("techniques.sublimationDesc")}
            </li>
            <li>
              <strong>Broderie</strong> — {t("techniques.embroideryDesc")}
            </li>
            <li>
              <strong>Vinyle</strong> — {t("techniques.vinylDesc")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
