"use client";
import { useRef, useState } from "react";
import CustomizerCanvas, {
  type CustomizerHandle,
} from "@/components/CustomizerCanvas";
import TermsModal from "@/components/TermsModal";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CustomizerPage() {
  const t = useTranslations("customizer");
  const ref = useRef<CustomizerHandle | null>(null);
  const [base, setBase] = useState("/assets/products/tshirt.svg");
  const [showTermsModal, setShowTermsModal] = useState(false);
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
      <CustomizerCanvas ref={ref} baseImage={base} />
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
