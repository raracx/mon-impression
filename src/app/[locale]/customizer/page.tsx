"use client";
import { useRef, useState } from "react";
import CustomizerCanvas, {
  type CustomizerHandle,
} from "@/components/CustomizerCanvas";
import TermsModal from "@/components/TermsModal";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Garment color options
const GARMENT_COLORS = [
  { id: "white", color: "#FFFFFF", labelKey: "white" },
  { id: "black", color: "#1a1a1a", labelKey: "black" },
  { id: "navy", color: "#1e3a5f", labelKey: "navy" },
  { id: "darkGray", color: "#4a4a4a", labelKey: "darkGray" },
  { id: "lightGray", color: "#d1d5db", labelKey: "lightGray" },
];

export default function CustomizerPage() {
  const t = useTranslations("customizer");
  const ref = useRef<CustomizerHandle | null>(null);
  const [base, setBase] = useState("/assets/products/tshirt.svg");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const router = useRouter();

  const checkout = async () => {
    const exportUrl = ref.current?.exportDesign();
    if (!exportUrl) return;

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ name: "Produit personnalisé", amount: 2500, quantity: 1 }],
        designUrl: exportUrl,
      }),
    });
    const { url } = await res.json();
    router.push(url);
  };

  const handleCheckoutClick = () => {
    const exportUrl = ref.current?.exportDesign();
    if (!exportUrl) return;
    setShowTermsModal(true);
  };

  const handleTermsConfirm = () => {
    setShowTermsModal(false);
    checkout();
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    ref.current?.setGarmentColor(color);
  };

  return (
    <div className="container-page py-10 space-y-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div className="flex gap-2">
        {[
          { key: "tshirt", img: "/assets/products/tshirt.svg" },
          { key: "hoodie", img: "/assets/products/hoodie.svg" },
          { key: "mug", img: "/assets/products/mug.svg" },
        ].map((p) => (
          <button
            key={p.key}
            className={`btn-primary ${base === p.img ? "bg-slate-800" : ""}`}
            onClick={() => setBase(p.img)}
          >
            {t(`products.${p.key}`)}
          </button>
        ))}
      </div>

      {/* Garment Color Swatches */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {t("garmentColor")}
        </h3>
        <div className="flex flex-wrap gap-3">
          {GARMENT_COLORS.map((colorOption) => (
            <button
              key={colorOption.id}
              onClick={() => handleColorChange(colorOption.color)}
              className={`group flex flex-col items-center gap-1.5 transition-all`}
              title={t(`colors.${colorOption.labelKey}`)}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm hover:shadow-md hover:scale-110 ${
                  selectedColor === colorOption.color
                    ? "border-blue-600 ring-2 ring-blue-300 scale-110"
                    : "border-slate-300 hover:border-slate-400"
                }`}
                style={{ backgroundColor: colorOption.color }}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  selectedColor === colorOption.color
                    ? "text-blue-600"
                    : "text-slate-600 group-hover:text-slate-900"
                }`}
              >
                {t(`colors.${colorOption.labelKey}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <CustomizerCanvas
        ref={ref}
        baseImage={base}
        initialGarmentColor={selectedColor}
        onGarmentColorChange={setSelectedColor}
      />
      <div className="flex gap-3">
        <button className="btn-primary" onClick={handleCheckoutClick}>
          {t("addToCart")}
        </button>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onConfirm={handleTermsConfirm}
      />
    </div>
  );
}
