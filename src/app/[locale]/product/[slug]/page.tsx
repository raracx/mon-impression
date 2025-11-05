"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GARMENTS, COLORS, SIZES } from "@/data/catalog";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import ProductPreviewCanvas, {
  type ProductPreviewHandle,
} from "@/components/ProductPreviewCanvas";

type LogoPosition = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const images: Record<string, string> = {
  tshirt: "/assets/tshirt/front.png",
  hoodie: "/assets/hoodie.jpeg",
  mug: "/assets/products/mug.svg",
  mask: "/assets/products/mask.svg",
  casquette: "/assets/casquetterrouge.jpg",
  "hoodie-noir": "/assets/hoodienoir.jpg",
};

// Logo positions for different products (percentages of canvas dimensions)
// x: horizontal position (0 = left, 1 = right) - typically 0.22-0.25 for left chest
// y: vertical position (0 = top, 1 = bottom) - typically 0.28-0.35 for chest area
// w: width as percentage of canvas width
// h: height as percentage of canvas height
const logoPositions: Record<string, LogoPosition> = {
  tshirt: { x: 0.6, y: 0.28, w: 0.12, h: 0.14 },
  hoodie: { x: 0.23, y: 0.3, w: 0.14, h: 0.14 },
  casquette: { x: 0.35, y: 0.4, w: 0.3, h: 0.2 },
  mug: { x: 0.3, y: 0.35, w: 0.4, h: 0.3 },
  mask: { x: 0.25, y: 0.35, w: 0.5, h: 0.3 },
  // Add more products as needed
};

// Front text positions for different products (abdomen area)
type FrontTextPosition = {
  x: number; // percentage (0-1)
  y: number; // percentage (0-1)
  fontSize: number; // percentage of canvas width (0-1)
};

const frontTextPositions: Record<string, FrontTextPosition> = {
  tshirt: { x: 0.5, y: 0.65, fontSize: 0.08 },
  hoodie: { x: 0.5, y: 0.68, fontSize: 0.07 },
  casquette: { x: 0.5, y: 0.6, fontSize: 0.06 },
  mug: { x: 0.5, y: 0.5, fontSize: 0.06 },
  mask: { x: 0.5, y: 0.55, fontSize: 0.05 },
  // Add more products as needed
};

// Back long logo positions for different products
const backLogoPositions: Record<string, LogoPosition> = {
  tshirt: { x: 0.27, y: 0.25, w: 0.45, h: 0.1 },
  hoodie: { x: 0.2, y: 0.38, w: 0.6, h: 0.15 },
  casquette: { x: 0.2, y: 0.4, w: 0.6, h: 0.2 },
  mug: { x: 0.15, y: 0.35, w: 0.7, h: 0.3 },
  mask: { x: 0.15, y: 0.35, w: 0.7, h: 0.3 },
  // Add more products as needed
};

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const t = useTranslations("product");
  const tProducts = useTranslations("products");
  const isFr = locale === "fr";

  const [selectedSide, setSelectedSide] = useState<"front" | "back" | "both">(
    "front",
  );
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string>(
    "/assets/logo-defaults/youtube-logo.svg",
  );
  const [frontText, setFrontText] = useState<string>("");
  const [backLogoImage, setBackLogoImage] = useState<string>(
    "/assets/logo-defaults/youtube-long-logo.svg",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backLogoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<ProductPreviewHandle>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoImage("/assets/logo-defaults/youtube-logo.svg");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBackLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackLogo = () => {
    setBackLogoImage("/assets/logo-defaults/youtube-long-logo.svg");
    if (backLogoInputRef.current) {
      backLogoInputRef.current.value = "";
    }
  };

  const handleDownloadPreview = () => {
    const dataUrl = previewRef.current?.exportImage();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${slug}-preview.png`;
    a.click();
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
  const imageFront = garment?.imageFront || images[slug] || images["tshirt"];
  const imageBack = garment?.imageBack || images[slug] || images["tshirt"];

  const displayImage = selectedSide === "back" ? imageBack : imageFront;

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

  // Get logo position for current product, fallback to tshirt default
  const currentLogoPosition = logoPositions[slug] ||
    logoPositions.tshirt || { x: 0.22, y: 0.28, w: 0.15, h: 0.15 };

  // Get front text position for current product, fallback to tshirt default
  const currentFrontTextPosition = frontTextPositions[slug] ||
    frontTextPositions.tshirt || { x: 0.5, y: 0.65, fontSize: 0.08 };

  // Get back logo position for current product, fallback to tshirt default
  const currentBackLogoPosition = backLogoPositions[slug] ||
    backLogoPositions.tshirt || { x: 0.2, y: 0.35, w: 0.6, h: 0.15 };

  return (
    <div className="container-page py-10">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Image Section */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {selectedSide === "both" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div
                  className="card overflow-hidden relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setFullscreenImage(imageFront)}
                >
                  <ProductPreviewCanvas
                    baseImage={imageFront}
                    logoImage={logoImage}
                    side="front"
                    logoPosition={currentLogoPosition}
                    frontText={frontText}
                    frontTextPosition={currentFrontTextPosition}
                    backLogoImage={backLogoImage}
                    backLogoPosition={currentBackLogoPosition}
                  />
                </div>
                <p className="text-center text-sm font-medium text-slate-600">
                  {isFr ? "Avant" : "Front"}
                </p>
              </div>
              <div className="space-y-2">
                <div
                  className="card overflow-hidden relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setFullscreenImage(imageBack)}
                >
                  <ProductPreviewCanvas
                    baseImage={imageBack}
                    logoImage={logoImage}
                    side="back"
                    logoPosition={currentLogoPosition}
                    frontText={frontText}
                    frontTextPosition={currentFrontTextPosition}
                    backLogoImage={backLogoImage}
                    backLogoPosition={currentBackLogoPosition}
                  />
                </div>
                <p className="text-center text-sm font-medium text-slate-600">
                  {isFr ? "Arrière" : "Back"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="card overflow-hidden relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setFullscreenImage(displayImage)}
            >
              <ProductPreviewCanvas
                ref={previewRef}
                baseImage={displayImage}
                logoImage={logoImage}
                side={selectedSide === "back" ? "back" : "front"}
                logoPosition={currentLogoPosition}
                frontText={frontText}
                frontTextPosition={currentFrontTextPosition}
                backLogoImage={backLogoImage}
                backLogoPosition={currentBackLogoPosition}
              />
            </div>
          )}
          {/* Side Selector */}
          <div className="card p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isFr ? "Côté d'impression" : "Print Side"}
            </label>
            <select
              value={selectedSide}
              onChange={(e) =>
                setSelectedSide(e.target.value as "front" | "back" | "both")
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            >
              <option value="front">
                {isFr ? "Avant seulement" : "Front only"}
              </option>
              <option value="back">
                {isFr ? "Arrière seulement" : "Back only"}
              </option>
              <option value="both">
                {isFr ? "Avant et arrière" : "Front and back"}
              </option>
            </select>
          </div>

          {/* Logo Upload Section */}
          <div className="card p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isFr ? "Télécharger votre logo" : "Upload Your Logo"}
            </label>

            {/* Logo Preview */}
            {logoImage && (
              <div className="mb-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">
                    {isFr ? "Aperçu du logo" : "Logo Preview"}
                  </span>
                  {logoImage !== "/assets/logo-defaults/youtube-logo.svg" && (
                    <button
                      onClick={handleRemoveLogo}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      {isFr ? "Supprimer" : "Remove"}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <Image
                      src={logoImage}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
            >
              {isFr ? "Choisir un fichier" : "Choose File"}
            </button>
            <p className="text-xs text-slate-500 mt-2">
              {isFr
                ? "Le logo s'affichera sur la poitrine gauche (avant seulement)"
                : "Logo will appear on left chest (front only)"}
            </p>
            <button
              onClick={handleDownloadPreview}
              className="w-full mt-3 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              {isFr ? "Télécharger l'aperçu" : "Download Preview"}
            </button>
          </div>

          {/* Front Text Input Section */}
          <div className="card p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isFr
                ? "Texte sur l'abdomen (optionnel)"
                : "Abdomen Text (optional)"}
            </label>
            <input
              type="text"
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              placeholder={
                isFr ? "Entrez un nom ou un texte" : "Enter a name or text"
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              maxLength={50}
            />
            <p className="text-xs text-slate-500 mt-2">
              {isFr
                ? "Le texte s'affichera sur l'abdomen (avant)"
                : "Text will appear on the abdomen (front)"}
            </p>
          </div>

          {/* Back Long Logo Upload Section */}
          <div className="card p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isFr ? "Logo long pour le dos" : "Long Logo for Back"}
            </label>

            {/* Back Logo Preview */}
            {backLogoImage && (
              <div className="mb-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">
                    {isFr ? "Aperçu du logo dos" : "Back Logo Preview"}
                  </span>
                  {backLogoImage !==
                    "/assets/logo-defaults/youtube-long-logo.svg" && (
                    <button
                      onClick={handleRemoveBackLogo}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      {isFr ? "Supprimer" : "Remove"}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-16">
                    <Image
                      src={backLogoImage}
                      alt="Back logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            <input
              ref={backLogoInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => backLogoInputRef.current?.click()}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
            >
              {isFr ? "Choisir un fichier" : "Choose File"}
            </button>
            <p className="text-xs text-slate-500 mt-2">
              {isFr
                ? "Le logo long s'affichera au centre du dos (format horizontal recommandé)"
                : "Long logo will appear centered on the back (horizontal format recommended)"}
            </p>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            {garment?.audience && (
              <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {name}
            </h1>
            <p className="text-slate-600 mt-3 text-lg leading-relaxed">
              {garment
                ? isFr
                  ? garment.descriptionFr
                  : garment.descriptionEn
                : t("description", { name })}
            </p>
          </div>

          {/* Pricing Section */}
          {garment && garment.prices.length > 0 && (
            <div className="card p-6 bg-slate-50 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {isFr ? "Tarification" : "Pricing"}
              </h2>
              <div className="space-y-3">
                {garment.prices.map((p) => (
                  <div
                    key={isFr ? p.labelFr : p.labelEn}
                    className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 last:border-0 last:pb-0"
                  >
                    <span className="text-slate-700 text-sm flex-1">
                      {isFr ? p.labelFr : p.labelEn}
                    </span>
                    <span className="font-bold text-lg text-slate-900 whitespace-nowrap">
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
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {isFr ? "Caractéristiques" : "Features"}
                </h2>
                <ul className="space-y-3">
                  {(isFr ? garment.featuresFr : garment.featuresEn).map(
                    (feature) => (
                      <li
                        key={feature}
                        className="flex items-start text-slate-700"
                      >
                        <svg
                          className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
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
          <div className="card p-6 bg-blue-50 border border-blue-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              {isFr ? "Couleurs disponibles" : "Available Colors"}
            </h2>
            <p className="text-slate-700 mb-4">
              {(isFr ? COLORS.fr : COLORS.en).join(", ")}
            </p>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              {isFr ? "Tailles disponibles" : "Available Sizes"}
            </h2>
            <p className="text-slate-700">
              {garment?.audience === "kids"
                ? isFr
                  ? SIZES.kidsFr
                  : SIZES.kidsEn
                : isFr
                  ? SIZES.adultFr
                  : SIZES.adultEn}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="sticky bottom-4 z-10 space-y-3">
            <button
              onClick={handleDownloadPreview}
              className="btn-primary w-full text-center text-lg py-4 shadow-lg hover:shadow-xl"
            >
              {isFr ? "Terminé" : "Done"}
            </button>
            <Link
              href={`/product/${slug}/personnaliser?side=${selectedSide}&logo=${encodeURIComponent(logoImage)}&frontText=${encodeURIComponent(frontText)}&backLogo=${encodeURIComponent(backLogoImage)}`}
              className="w-full text-center text-lg py-4 shadow-md hover:shadow-lg inline-block bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all rounded-lg font-semibold"
            >
              {tProducts("customize")}
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="card p-8 bg-gradient-to-br from-slate-50 to-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
          {isFr ? "Procédé d'impression" : "Printing Process"}
        </h2>
        <p className="text-slate-700 text-center max-w-3xl mx-auto leading-relaxed">
          {isFr
            ? "Procédé DTF par défaut — durable, souple et précis. Sublimation et broderie disponibles sur demande pour certains produits."
            : "Default DTF process — durable, flexible and precise. Sublimation and embroidery available on request for certain products."}
        </p>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            <div className="w-full h-full">
              <ProductPreviewCanvas
                baseImage={fullscreenImage}
                logoImage={logoImage}
                side={fullscreenImage === imageBack ? "back" : "front"}
                logoPosition={currentLogoPosition}
                frontText={frontText}
                frontTextPosition={currentFrontTextPosition}
                backLogoImage={backLogoImage}
                backLogoPosition={currentBackLogoPosition}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
