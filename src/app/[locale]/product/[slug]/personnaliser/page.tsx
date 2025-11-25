"use client";
import { useEffect, useRef, useState } from "react";
import CustomizerCanvas, {
  type CustomizerHandle,
  type CanvasItem,
} from "@/components/CustomizerCanvas";
import Toolbox from "@/components/Toolbox";
import StickersPanel from "@/components/StickersPanel";
import TermsModal from "@/components/TermsModal";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ShoppingCart,
} from "lucide-react";

const productImages: Record<string, string> = {
  // use the new TShirt images (front view by default)
  tshirt: "/assets/tshirt/TShirtFront.png",
  hoodie: "/assets/hoodie.jpeg",
  mug: "/assets/products/mug.svg",
  mask: "/assets/products/mask.svg",
  casquette: "/assets/casquetterrouge.jpg",
  "hoodie-noir": "/assets/hoodienoir.jpg",
};

export default function PersonnaliserPage({
  params,
}: {
  params: { slug: string };
}) {
  const t = useTranslations("personnaliser");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"tools" | "stickers">("tools");
  const ref = useRef<CustomizerHandle | null>(null);
  const productId = params.slug;
  const [base, setBase] = useState<string>(
    productImages[productId] || "/assets/tshirt/TShirtFront.png"
  );

  // track selected item from canvas so toolbox can show editing UI
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);
  // track pan mode for visual indicator in toolbox
  const [panMode, setPanMode] = useState(false);

  useEffect(() => {
    const img = searchParams.get("img");
    if (img) {
      if (img.startsWith("http")) {
        setBase(`/api/img?url=${encodeURIComponent(img)}`);
      } else {
        setBase(img);
      }
    } else
      setBase(productImages[productId] || "/assets/tshirt/TShirtFront.png");
  }, [searchParams, productId]);

  const order = async () => {
    if (!ref.current) return;
    setLoading(true);
    const dataUrl = ref.current.exportDesign();
    if (!dataUrl) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email, design: dataUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("errorOrder"));
      const { orderId } = json;
      const pay = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId }),
      });
      const payJson = await pay.json();
      if (!pay.ok) throw new Error(payJson.error || t("errorStripe"));
      setLoading(false);
      router.push(payJson.url);
    } catch (e: any) {
      setLoading(false);
      alert(e.message);
    }
  };

  const handleOrderClick = () => {
    setShowTermsModal(true);
  };

  const handleTermsConfirm = () => {
    setShowTermsModal(false);
    order();
  };

  const download = () => {
    const url = ref.current?.exportDesign();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `design-${productId}.png`;
    a.click();
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="relative flex items-start px-4 py-4 gap-4">
        {/* Canvas Area */}
        <div className="flex-1">
          <div className="pb-8">
            <div className="max-w-5xl mx-auto space-y-6">
              <CustomizerCanvas
                ref={ref}
                baseImage={base}
                productId={productId}
                onSelectionChange={(it) => setSelectedItem(it)}
              />

              {/* Title and Action Buttons Below Canvas */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                      {t("title", { product: productId })}
                    </h1>
                    <p className="text-sm text-slate-600 mt-2">
                      {t("subtitle")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={download}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("download")}</span>
                    </button>
                    <button
                      onClick={handleOrderClick}
                      disabled={!email || loading}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {loading ? t("loading") : t("orderNow")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Collapsible */}
        <div
          className={`sticky top-[96px] self-start h-[calc(100vh-112px)] w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl transform transition-transform duration-300 z-20 overflow-hidden flex flex-col shrink-0 ${
            rightPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="fixed -left-12 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-lg p-2 shadow-lg hover:bg-slate-50 transition-colors z-30"
            aria-label="Toggle panel"
            style={{ right: rightPanelOpen ? "calc(1rem + 384px)" : "1rem" }}
          >
            {rightPanelOpen ? (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab("tools")}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors relative ${
                activeTab === "tools"
                  ? "text-blue-600 bg-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {t("toolsTab")}
              {activeTab === "tools" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("stickers")}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors relative ${
                activeTab === "stickers"
                  ? "text-blue-600 bg-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {t("designsTab")}
              {activeTab === "stickers" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "tools" ? (
              <div className="p-4">
                <Toolbox
                  onAddText={() => ref.current?.addText()}
                  onUploadImage={(f) => ref.current?.addImage(f)}
                  onColor={(c) => ref.current?.setColor(c)}
                  onDelete={() => ref.current?.deleteSelected()}
                  onFontFamily={(f) => ref.current?.setFontFamily(f)}
                  onFontSize={(s) => ref.current?.setFontSize(s)}
                  onBold={() => ref.current?.toggleBold()}
                  onItalic={() => ref.current?.toggleItalic()}
                  onAlign={(a) => ref.current?.alignText(a)}
                  onStroke={(c) => ref.current?.setStroke(c)}
                  onStrokeWidth={(w) => ref.current?.setStrokeWidth(w)}
                  onDuplicate={() => ref.current?.duplicateSelected()}
                  onForward={() => ref.current?.bringForward()}
                  onBackward={() => ref.current?.sendBackward()}
                  onToggleGrid={() => ref.current?.toggleGrid()}
                  onSetSide={(s) => ref.current?.setSide(s)}
                  productId={productId}
                  selectedText={
                    selectedItem?.type === "text"
                      ? selectedItem.text || ""
                      : undefined
                  }
                  isTextSelected={selectedItem?.type === "text"}
                  onEditText={(text: string) =>
                    ref.current?.setSelectedText(text)
                  }
                  onZoomIn={() => ref.current?.zoomIn()}
                  onZoomOut={() => ref.current?.zoomOut()}
                  onResetZoom={() => ref.current?.resetZoom()}
                  onTogglePan={() => {
                    ref.current?.togglePan();
                    setPanMode((v) => !v);
                  }}
                  panMode={panMode}
                  onExport={download}
                />
              </div>
            ) : (
              <div className="p-4">
                <StickersPanel
                  onPick={(url) => ref.current?.addImageFromUrl(url)}
                />
              </div>
            )}
          </div>

          {/* Order Section - Fixed at Bottom */}
          <div className="border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                {t("emailLabel")}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("paymentNote")}
            </p>
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onConfirm={handleTermsConfirm}
      />
    </div>
  );
}
