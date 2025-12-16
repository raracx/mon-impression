"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GARMENTS, COLORS } from "@/data/catalog";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import TermsModal from "@/components/TermsModal";

const images: Record<string, string> = {
  tshirt: "/Products/front.png",
  hoodie: "/assets/hoodie.jpeg",
  mug: "/assets/products/mug.svg",
  mask: "/assets/products/mask.svg",
  casquette: "/assets/casquetterrouge.jpg",
  "hoodie-noir": "/assets/hoodienoir.jpg",
};

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const t = useTranslations("product");
  const tProducts = useTranslations("products");
  const isFr = locale === "fr";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [customTshirtImage, setCustomTshirtImage] = useState<string | null>(
    null,
  );
  const [specifications, setSpecifications] = useState({
    size: "",
    description: "",
    name: "",
    email: "",
  });
  const tshirtImageInputRef = useRef<HTMLInputElement>(null);

  const handleCustomTshirtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomTshirtImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomTshirt = () => {
    setCustomTshirtImage(null);
    if (tshirtImageInputRef.current) {
      tshirtImageInputRef.current.value = "";
    }
  };

  const handleSpecificationsChange = (
    field: keyof typeof specifications,
    value: string,
  ) => {
    setSpecifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customTshirtImage) {
      alert(isFr ? "Veuillez télécharger une image" : "Please upload an image");
      return;
    }
    // Show terms modal instead of directly processing
    setShowTermsModal(true);
  };

  const processOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: slug,
          email: specifications.email,
          design: customTshirtImage,
          size: specifications.size,
          description: specifications.description,
          name: specifications.name,
          locale,
        }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(
          json.error || (isFr ? "Erreur de commande" : "Order error"),
        );
      const { orderId } = json;
      const pay = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId: slug,
          cancel_url: window.location.href,
        }),
      });
      const payJson = await pay.json();
      if (!pay.ok)
        throw new Error(
          payJson.error || (isFr ? "Erreur de paiement" : "Payment error"),
        );
      setLoading(false);
      router.push(payJson.url);
    } catch (e: any) {
      setLoading(false);
      alert(e.message);
    }
  };

  const handleTermsConfirm = () => {
    setShowTermsModal(false);
    processOrder();
  };

  // Map slug to garment slug
  const slugMap: Record<string, string> = {
    tshirt: "tee-short",
    hoodie: "hoodie",
    casquette: "trucker-cap",
  };

  const garmentSlug = slugMap[slug] || slug;
  const garment = GARMENTS.find((g) => g.slug === garmentSlug);

  const image = garment?.image || images[slug] || images["tshirt"];

  const keyMap: Record<string, string> = {
    tshirt: "teeShort",
    "tee-short": "teeShort",
    "tee-long": "teeLong",
    hoodie: "hoodie",
    "hoodie-noir": "hoodie",
    casquette: "truckerCap",
    "trucker-cap": "truckerCap",
    mug: "mug",
    mask: "mask",
    crewneck: "crewneck",
  };

  const nameKey = keyMap[slug] || keyMap[garmentSlug] || slug;
  const knownKeys = [
    "mug",
    "mask",
    "hoodie",
    "crewneck",
    "teeShort",
    "teeLong",
    "teeShortKid",
    "truckerCap",
  ] as const;

  const name = (knownKeys as readonly string[]).includes(nameKey)
    ? tProducts(nameKey as any)
    : garment
      ? isFr
        ? garment.titleFr
        : garment.titleEn
      : slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="container-page py-10">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Image Section */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="card p-4">
            <label className="block text-sm font-semibold text-brand-gray-dark mb-2">
              {isFr
                ? "Télécharger votre T-shirt personnalisé"
                : "Upload Your Custom T-shirt"}
            </label>

            {/* Custom T-shirt Preview */}
            {customTshirtImage ? (
              <div className="mb-3 p-4 bg-brand-gray-lighter rounded-lg border border-brand-gray-light">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-brand-gray-dark">
                    {isFr ? "Aperçu du T-shirt" : "T-shirt Preview"}
                  </span>
                  <button
                    onClick={handleRemoveCustomTshirt}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    {isFr ? "Supprimer" : "Remove"}
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-64">
                    <Image
                      src={customTshirtImage}
                      alt="Custom t-shirt preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-3 p-4 bg-brand-gray-lighter rounded-lg border border-brand-gray-light">
                <div className="flex items-center justify-center h-64">
                  <p className="text-brand-gray-dark text-center">
                    {isFr ? "Aucune image téléchargée" : "No image uploaded"}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={tshirtImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomTshirtUpload}
              className="hidden"
            />
            <button
              onClick={() => tshirtImageInputRef.current?.click()}
              className="w-full px-4 py-2 border border-brand-gray-light rounded-lg hover:bg-brand-gray-lighter transition-colors text-brand-gray-dark font-medium"
            >
              {isFr ? "Choisir un fichier" : "Choose File"}
            </button>
            <p className="text-xs text-brand-gray-dark mt-2">
              {isFr
                ? "Téléchargez une photo claire de votre T-shirt personnalisé"
                : "Upload a clear photo of your custom T-shirt"}
            </p>
          </div>

          {/* Specifications Section */}
          <form onSubmit={handleSubmit} className="card p-4">
            <h3 className="text-lg font-semibold text-brand-black mb-4">
              {isFr ? "Spécifications" : "Specifications"}
            </h3>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-dark mb-2">
                {isFr ? "Nom" : "Name"}
              </label>
              <input
                name="name"
                type="text"
                value={specifications.name}
                onChange={(e) =>
                  handleSpecificationsChange("name", e.target.value)
                }
                className="w-full px-4 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-dark mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={specifications.email}
                onChange={(e) =>
                  handleSpecificationsChange("email", e.target.value)
                }
                className="w-full px-4 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                required
              />
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-dark mb-2">
                {isFr ? "Taille" : "Size"}
              </label>
              <select
                name="size"
                value={specifications.size}
                onChange={(e) =>
                  handleSpecificationsChange("size", e.target.value)
                }
                className="w-full px-4 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                required
              >
                <option value="">
                  {isFr ? "Sélectionner une taille" : "Select a size"}
                </option>
                {(garment?.audience === "kids"
                  ? ["XS", "S", "M", "L", "XL"]
                  : ["S", "M", "L", "XL", "2XL", "3XL"]
                ).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-dark mb-2">
                {isFr ? "Description détaillée" : "Detailed Description"}
              </label>
              <textarea
                name="description"
                value={specifications.description}
                onChange={(e) =>
                  handleSpecificationsChange("description", e.target.value)
                }
                className="w-full px-4 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                rows={4}
                placeholder={
                  isFr
                    ? "Ajoutez des détails spécifiques sur votre T-shirt personnalisé..."
                    : "Add specific details about your custom T-shirt..."
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-center text-lg py-4 shadow-lg hover:shadow-xl"
            >
              {loading
                ? isFr
                  ? "Chargement..."
                  : "Loading..."
                : isFr
                  ? "Procéder au paiement"
                  : "Proceed to Checkout"}
            </button>
          </form>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            {garment?.audience && (
              <span className="inline-block bg-navy-50 text-navy px-3 py-1 rounded-full text-sm font-medium mb-3">
                {garment.audience === "kids"
                  ? isFr
                    ? "Enfants"
                    : "Kids"
                  : garment.audience === "adult"
                    ? isFr
                      ? "Adultes"
                      : "Adults"
                    : "Unisexe"}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black">
              {name}
            </h1>
            <p className="text-brand-gray-dark mt-3 text-lg leading-relaxed">
              {garment
                ? isFr
                  ? garment.descriptionFr
                  : garment.descriptionEn
                : t("description", { name })}
            </p>
          </div>

          {/* Pricing Section */}
          {garment && garment.prices.length > 0 && (
            <div className="card p-6 bg-brand-gray-lighter border border-brand-gray-light">
              <h2 className="text-lg font-bold text-brand-black mb-4">
                {isFr ? "Tarification" : "Pricing"}
              </h2>
              <div className="space-y-3">
                {garment.prices.map((p) => (
                  <div
                    key={isFr ? p.labelFr : p.labelEn}
                    className="flex items-start justify-between gap-4 pb-3 border-b border-brand-gray-light last:border-0 last:pb-0"
                  >
                    <span className="text-brand-gray-dark text-sm flex-1">
                      {isFr ? p.labelFr : p.labelEn}
                    </span>
                    <span className="font-bold text-lg text-brand-black whitespace-nowrap">
                      {p.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {garment &&
            (isFr ? garment.featuresFr : garment.featuresEn).length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-brand-black mb-4">
                  {isFr ? "Caractéristiques" : "Features"}
                </h2>
                <ul className="space-y-3">
                  {(isFr ? garment.featuresFr : garment.featuresEn).map(
                    (feature) => (
                      <li
                        key={feature}
                        className="flex items-start text-brand-gray-dark"
                      >
                        <svg
                          className="w-5 h-5 text-navy mr-3 mt-0.5 flex-shrink-0"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

          {/* Colors & Sizes Info */}
          <div className="card p-6 bg-navy-50 border border-navy-100">
            <h2 className="text-lg font-bold text-brand-black mb-3">
              {isFr ? "Couleurs disponibles" : "Available Colors"}
            </h2>
            <p className="text-brand-gray-dark mb-4">
              {(isFr ? COLORS.fr : COLORS.en).join(", ")}
            </p>
            <h2 className="text-lg font-bold text-brand-black mb-3">
              {isFr ? "Tailles disponibles" : "Available Sizes"}
            </h2>
            <p className="text-brand-gray-dark">
              {garment?.audience === "kids"
                ? "XS, S, M, L, XL"
                : "S, M, L, XL, 2XL, 3XL"}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="card p-8 bg-gradient-to-br from-brand-gray-lighter to-white">
        <h2 className="text-2xl font-bold text-brand-black mb-4 text-center">
          {isFr ? "Procédé d'impression" : "Printing Process"}
        </h2>
        <p className="text-brand-gray-dark text-center max-w-3xl mx-auto leading-relaxed">
          {isFr
            ? "Procédé DTF par défaut — durable, souple et précis. Sublimation et broderie disponibles sur demande pour certains produits."
            : "Default DTF process — durable, flexible and precise. Sublimation and embroidery available on request for certain products."}
        </p>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onConfirm={handleTermsConfirm}
      />
    </div>
  );
}
