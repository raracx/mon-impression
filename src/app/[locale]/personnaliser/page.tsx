"use client";
import { Suspense, useEffect, useRef, useState } from "react";
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
  tshirt: "/Products/BlackTShirtFront.png",
  hoodie: "/Products/BlackHoodieFront.png",
  crewneck: "/Products/BlackCrewneckFront.png",
  longsleeve: "/Products/WhiteLongSleeveFront.png",
  cap: "/Products/BlackCap.png",
  mug_large: "/Products/front.png",
  mug_small: "/Products/front.png",
  mug_frosted: "/Products/front.png",
  mug_magic: "/Products/front.png",
  mug_ceramic: "/Products/front.png",
  mousepad: "/Products/MousePad.jpg",
  bag: "/Products/ShoppingBag.png",
  drawstring_bag: "/Products/DrawstringBag.png",
  shopping_bag: "/Products/ShoppingBag.png",
  license_plate: "/Products/LicensePlate.png",
  suction_poster: "/Products/SuctionPoster.png",
};

const products = [
  // Clothing
  {
    id: "tshirt",
    name: "T-Shirt manches courtes",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 19.99,
      twoSides: 22.99,
      fullPrint: 25.99,
    },
  },
  {
    id: "longsleeve",
    name: "T-Shirt manches longues",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 21.99,
      twoSides: 24.99,
      fullPrint: 27.99,
    },
  },
  {
    id: "hoodie",
    name: "Chandail à capuchon (Hoodie)",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 29.99,
      twoSides: 34.99,
      fullPrint: 39.99,
    },
  },
  {
    id: "crewneck",
    name: "Chandail à col rond",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 27.99,
      twoSides: 32.99,
      fullPrint: 37.99,
    },
  },
  // Accessories
  {
    id: "cap",
    name: "Casquette",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 25.0,
      twoSides: 25.0,
      fullPrint: 25.0,
    },
  },
  {
    id: "mug_large",
    name: "Tasse isotherme (Grande - 591ml)",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 25.0,
      twoSides: 25.0,
      fullPrint: 25.0,
    },
  },
  {
    id: "mug_small",
    name: "Tasse isotherme (Petite - 355ml)",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 22.0,
      twoSides: 22.0,
      fullPrint: 22.0,
    },
  },
  {
    id: "mug_frosted",
    name: "Tasse givrée (473ml)",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  {
    id: "mug_magic",
    name: "Tasse magique noire (325ml)",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  {
    id: "mug_ceramic",
    name: "Tasse céramique blanche (325ml)",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 15.0,
      twoSides: 15.0,
      fullPrint: 15.0,
    },
  },
  {
    id: "mousepad",
    name: "Tapis de souris",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 12.0,
      twoSides: 12.0,
      fullPrint: 12.0,
    },
  },
  {
    id: "shopping_bag",
    name: "Sac de magasinage",
    category: "accessory",
    isClothing: false,
    availableSides: ["front", "back"],
    pricing: {
      oneSide: 18.0,
      twoSides: 22.0,
      fullPrint: 22.0,
    },
  },
  {
    id: "drawstring_bag",
    name: "Sac à cordon",
    category: "accessory",
    isClothing: false,
    availableSides: ["front", "back"],
    pricing: {
      oneSide: 15.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  {
    id: "license_plate",
    name: "Plaque personnalisable pour véhicules",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  {
    id: "suction_poster",
    name: "Affiche avec ventouse",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 18.0,
      twoSides: 18.0,
      fullPrint: 18.0,
    },
  },
];

const clothingSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const productColors: Record<
  string,
  { id: string; name: string; images: Record<string, string> }[]
> = {
  tshirt: [
    {
      id: "black",
      name: "Black",
      images: {
        front: "/Products/BlackTShirtFront.png",
        back: "/Products/BlackTShirtBack.png",
        "left-sleeve": "/Products/BlackTShirtLeftSide.png",
        "right-sleeve": "/Products/BlackTShirtRightSide.png",
      },
    },
    {
      id: "white",
      name: "White",
      images: {
        front: "/Products/WhiteTShirtFront.png",
        back: "/Products/WhiteTShirtBack.png",
        "left-sleeve": "/Products/WhiteTShirtLeftSide.png",
        "right-sleeve": "/Products/WhiteTShirtRightSide.png",
      },
    },
    {
      id: "gray",
      name: "Gray",
      images: {
        front: "/Products/GrayTShirtFront.png",
        back: "/Products/GrayTShirtBack.png",
        "left-sleeve": "/Products/GrayTShirtLeftSide.png",
        "right-sleeve": "/Products/GrayTShirtRightSide.png",
      },
    },
    {
      id: "lightgray",
      name: "Light Gray",
      images: {
        front: "/Products/LightGrayTShirtFront.png",
        back: "/Products/LightGrayTShirtBack.png",
        "left-sleeve": "/Products/LightGrayTShirtLeftSide.png",
        "right-sleeve": "/Products/LightGrayTShirtRightSide.png",
      },
    },
    {
      id: "navy",
      name: "Navy",
      images: {
        front: "/Products/NavyTShirtFront.png",
        back: "/Products/NavyTShirtBack.png",
        "left-sleeve": "/Products/NavyTShirtLeftSide.png",
        "right-sleeve": "/Products/NavyTShirtRightSide.png",
      },
    },
  ],
  hoodie: [
    {
      id: "black",
      name: "Black",
      images: {
        front: "/Products/BlackHoodieFront.png",
        back: "/Products/BlackHoodieBack.png",
        "left-sleeve": "/Products/BlackHoodieLeftSide.png",
        "right-sleeve": "/Products/BlackHoodieRightSide.png",
      },
    },
    {
      id: "white",
      name: "White",
      images: {
        front: "/Products/WhiteHoodieFront.png",
        back: "/Products/WhiteHoodieBack.png",
        "left-sleeve": "/Products/WhiteHoodieLeftSide.png",
        "right-sleeve": "/Products/WhiteHoodieRightSide.png",
      },
    },
    {
      id: "lightgray",
      name: "Light Gray",
      images: {
        front: "/Products/LightGrayHoodieFront.png",
        back: "/Products/LightGrayHoodieBack.png",
        "left-sleeve": "/Products/LightGrayHoodieLeftSide.png",
        "right-sleeve": "/Products/LightGrayHoodieRightSide.png",
      },
    },
    {
      id: "darkgray",
      name: "Dark Gray",
      images: {
        front: "/Products/DarkGrayHoodieFront.png",
        back: "/Products/DarkGrayHoodieBack.png",
        "left-sleeve": "/Products/DarkGrayHoodieLeftSide.png",
        "right-sleeve": "/Products/DarkGrayHoodieRightSide.png",
      },
    },
    {
      id: "navy",
      name: "Navy",
      images: {
        front: "/Products/NavyHoodieFront.png",
        back: "/Products/NavyHoodieBack.png",
        "left-sleeve": "/Products/NavyHoodieLeftSide.png",
        "right-sleeve": "/Products/NavyHoodieRightSide.png",
      },
    },
  ],
  crewneck: [
    {
      id: "black",
      name: "Black",
      images: {
        front: "/Products/BlackCrewneckFront.png",
        back: "/Products/BlackCrewneckBack.png",
        "left-sleeve": "/Products/BlackCrewneckLeftSide.png",
        "right-sleeve": "/Products/BlackCrewneckRightSide.png",
      },
    },
    {
      id: "white",
      name: "White",
      images: {
        front: "/Products/WhiteCrewneckFront.png",
        back: "/Products/WhiteCrewneckBack.png",
        "left-sleeve": "/Products/WhiteCrewneckLeftSide.png",
        "right-sleeve": "/Products/WhiteCrewneckRightSide.png",
      },
    },
    {
      id: "navy",
      name: "Navy",
      images: {
        front: "/Products/NavyCrewneckFront.png",
        back: "/Products/NavyCrewneckBack.png",
        "left-sleeve": "/Products/NavyCrewneckLeftSide.png",
        "right-sleeve": "/Products/NavyCrewneckRightSide.png",
      },
    },
    {
      id: "lightgray",
      name: "Light Gray",
      images: {
        front: "/Products/LightGrayCrewneckFront.png",
        back: "/Products/LightGrayCrewneckBack.png",
        "left-sleeve": "/Products/LightGrayCrewneckLeftSide.png",
        "right-sleeve": "/Products/LightGrayCrewneckRightSide.png",
      },
    },
  ],
  longsleeve: [
    {
      id: "white",
      name: "White",
      images: {
        front: "/Products/WhiteLongSleeveFront.png",
        back: "/Products/WhiteLongSleeveBack.png",
        "left-sleeve": "/Products/WhiteLongSleeveLeftSide.png",
        "right-sleeve": "/Products/WhiteLongSleeveRightSide.png",
      },
    },
  ],
  cap: [
    {
      id: "black",
      name: "Black",
      images: {
        front: "/Products/BlackCap.png",
        back: "/Products/BlackCap.png",
        "left-sleeve": "/Products/BlackCap.png",
        "right-sleeve": "/Products/BlackCap.png",
      },
    },
    {
      id: "navy",
      name: "Navy",
      images: {
        front: "/Products/NavyCap.png",
        back: "/Products/NavyCap.png",
        "left-sleeve": "/Products/NavyCap.png",
        "right-sleeve": "/Products/NavyCap.png",
      },
    },
  ],
};

function PersonnaliserContent() {
  const t = useTranslations("personnaliser");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"tools" | "stickers">("tools");
  const ref = useRef<CustomizerHandle | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("tshirt");
  const [selectedColor, setSelectedColor] = useState("black");
  const [activeSide, setActiveSide] = useState("front");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [customizedSidesCount, setCustomizedSidesCount] = useState(0);
  const [base, setBase] = useState<string>(
    productImages[selectedProduct] || "/Products/BlackTShirtFront.png"
  );

  // Update base image when product or color changes
  useEffect(() => {
    const colors = productColors[selectedProduct];
    if (colors && colors.length > 0) {
      const currentColor =
        colors.find((c) => c.id === selectedColor) || colors[0];
      setBase(
        currentColor.images[activeSide as keyof typeof currentColor.images] ||
          currentColor.images.front
      );
      if (!colors.find((c) => c.id === selectedColor)) {
        setSelectedColor(colors[0].id);
      }
    } else {
      setBase(
        productImages[selectedProduct] || "/Products/BlackTShirtFront.png"
      );
    }
  }, [selectedProduct, selectedColor, activeSide]);

  // track selected item from canvas so toolbox can show editing UI
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);
  // track pan mode for visual indicator in toolbox
  const [panMode, setPanMode] = useState(false);
  // track garment color
  const [garmentColor, setGarmentColor] = useState("#FFFFFF");

  // Calculate price based on number of customized sides
  const calculatePrice = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return 0;

    if (customizedSidesCount === 0 || customizedSidesCount === 1) {
      return product.pricing.oneSide;
    } else if (customizedSidesCount === 2) {
      return product.pricing.twoSides;
    } else {
      return product.pricing.fullPrint;
    }
  };

  const currentPrice = calculatePrice();

  // Update customized sides count when canvas changes
  const updateCustomizedSides = () => {
    if (ref.current) {
      const sides = ref.current.getCustomizedSides();
      setCustomizedSidesCount(sides.length);
    }
  };

  useEffect(() => {
    const img = searchParams.get("img");
    if (img) {
      if (img.startsWith("http")) {
        setBase(`/api/img?url=${encodeURIComponent(img)}`);
      } else {
        setBase(img);
      }
    }
  }, [searchParams]);

  // Update customized sides count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateCustomizedSides();
    }, 500);
    return () => clearInterval(interval);
  }, [selectedProduct, activeSide]);

  const order = async () => {
    if (!ref.current) return;
    setLoading(true);

    try {
      // Export all customized sides
      const customizedSides = ref.current.getCustomizedSides();
      if (customizedSides.length === 0) {
        alert("Veuillez personnaliser au moins un côté du produit");
        setLoading(false);
        return;
      }

      const allDesigns = await ref.current.exportAllSides();

      const product = products.find((p) => p.id === selectedProduct);
      const orderData = {
        productId: selectedProduct,
        email,
        designs: allDesigns, // Now sending all sides
        customizedSides: customizedSides, // Which sides were customized
        size: product?.isClothing ? selectedSize : undefined,
        quantity,
        color: selectedColor,
        price: currentPrice, // Dynamic price based on sides
        sidesCount: customizedSides.length,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("errorOrder"));
      const { orderId } = json;
      const pay = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId: selectedProduct }),
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
    a.download = `design-${selectedProduct}.png`;
    a.click();
  };

  return (
    <div className="bg-gradient-to-br from-brand-gray-lighter to-white min-h-screen">
      {/* Main Content */}
      <div className="relative flex items-start px-4 py-4 gap-4">
        {/* Left Info Panel */}
        <div className="w-80 shrink-0 hidden lg:block">
          <div className="bg-white border border-brand-gray-light rounded-2xl shadow-lg p-5 space-y-4">
            <div>
              <h1 className="text-lg font-bold text-brand-black">
                {t("title", { product: selectedProduct })}
              </h1>
              <p className="text-sm text-brand-gray-dark mt-1">
                {t("subtitle")}
              </p>
            </div>

            {/* Product Price */}
            <div className="border-t border-brand-gray-light pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-brand-gray-dark">
                  Prix:
                </span>
                <span className="text-xl font-bold text-navy">
                  ${currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-brand-gray-dark">
                  {customizedSidesCount === 0 && "Aucune personnalisation"}
                  {customizedSidesCount === 1 && "✓ 1 face personnalisée"}
                  {customizedSidesCount === 2 && "✓ 2 faces personnalisées"}
                  {customizedSidesCount >= 3 &&
                    "✓ Impression complète (3+ faces)"}
                </p>
                {(() => {
                  const product = products.find(
                    (p) => p.id === selectedProduct
                  );
                  if (!product) return null;
                  return (
                    <div className="text-xs text-brand-gray-dark bg-brand-gray-lighter p-2 rounded">
                      <div className="font-medium mb-1">Tarifs:</div>
                      <div className="flex justify-between">
                        <span>1 face:</span>
                        <span>${product.pricing.oneSide.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2 faces:</span>
                        <span>${product.pricing.twoSides.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complète:</span>
                        <span>${product.pricing.fullPrint.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Size and Quantity Selection */}
            <div className="border-t border-brand-gray-light pt-4">
              <div className="flex gap-2">
                {/* Size Selection for Clothing */}
                {products.find((p) => p.id === selectedProduct)?.isClothing && (
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-brand-gray-dark mb-2">
                      Taille:
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full border border-brand-gray-light rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
                    >
                      {clothingSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity Selection */}
                <div
                  className={
                    products.find((p) => p.id === selectedProduct)?.isClothing
                      ? "w-28"
                      : "flex-1"
                  }
                >
                  <label className="block text-xs font-medium text-brand-gray-dark mb-2">
                    Qté:
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-9 flex items-center justify-center border border-brand-gray-light rounded-lg hover:bg-navy-50 transition-colors text-sm font-semibold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-12 text-center border border-brand-gray-light rounded-lg px-1 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-9 flex items-center justify-center border border-brand-gray-light rounded-lg hover:bg-navy-50 transition-colors text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="border-t border-brand-gray-light pt-4">
              <label className="block text-sm font-medium text-brand-gray-dark mb-2">
                {t("emailLabel")}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full border border-brand-gray-light rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
              />
            </div>

            {/* Action Buttons */}
            <div className="border-t border-brand-gray-light pt-4 space-y-3">
              <button
                onClick={download}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-gray-lighter hover:bg-brand-gray-light text-brand-gray-dark rounded-lg font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                {t("download")}
              </button>
              <button
                onClick={handleOrderClick}
                disabled={!email || loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-navy to-navy-light hover:from-navy-dark hover:to-navy text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {loading ? t("loading") : t("orderNow")}
              </button>
              <p className="text-xs text-brand-gray-dark leading-relaxed text-center">
                {t("paymentNote")}
              </p>
            </div>
          </div>
        </div>

        {/* Canvas Area - Centered */}
        <div className="flex-1 flex justify-center">
          <div className="pb-8">
            <CustomizerCanvas
              ref={ref}
              baseImage={base}
              productId={selectedProduct}
              onSelectionChange={(it) => setSelectedItem(it)}
              initialGarmentColor={garmentColor}
              onGarmentColorChange={setGarmentColor}
            />
          </div>
        </div>

        {/* Right Sidebar - Collapsible */}
        <div
          className={`h-[calc(100vh-112px)] w-96 shrink-0 bg-white border border-brand-gray-light rounded-2xl shadow-2xl transform transition-transform duration-300 z-20 overflow-hidden flex flex-col ${
            rightPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="fixed -left-12 top-1/2 -translate-y-1/2 bg-white border border-brand-gray-light rounded-lg p-2 shadow-lg hover:bg-navy-50 transition-colors z-30"
            aria-label="Toggle panel"
            style={{ right: rightPanelOpen ? "calc(1rem + 384px)" : "1rem" }}
          >
            {rightPanelOpen ? (
              <ChevronRight className="w-5 h-5 text-brand-gray-dark" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-brand-gray-dark" />
            )}
          </button>

          {/* Tabs */}
          <div className="flex border-b border-brand-gray-light bg-brand-gray-lighter">
            <button
              onClick={() => setActiveTab("tools")}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors relative ${
                activeTab === "tools"
                  ? "text-navy bg-white"
                  : "text-brand-gray-dark hover:text-navy hover:bg-navy-50"
              }`}
            >
              {t("toolsTab")}
              {activeTab === "tools" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("stickers")}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors relative ${
                activeTab === "stickers"
                  ? "text-navy bg-white"
                  : "text-brand-gray-dark hover:text-brand-black hover:bg-brand-gray-lighter"
              }`}
            >
              {t("designsTab")}
              {activeTab === "stickers" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "tools" ? (
              <div className="p-4">
                <Toolbox
                  onAddText={() => {
                    ref.current?.addText();
                    setTimeout(updateCustomizedSides, 100);
                  }}
                  onUploadImage={(f) => {
                    ref.current?.addImage(f);
                    setTimeout(updateCustomizedSides, 100);
                  }}
                  onColor={(c) => ref.current?.setColor(c)}
                  onDelete={() => {
                    ref.current?.deleteSelected();
                    setTimeout(updateCustomizedSides, 100);
                  }}
                  onFontFamily={(f) => ref.current?.setFontFamily(f)}
                  onFontSize={(s) => ref.current?.setFontSize(s)}
                  onBold={() => ref.current?.toggleBold()}
                  onItalic={() => ref.current?.toggleItalic()}
                  onAlign={(a) => ref.current?.alignText(a)}
                  onStroke={(c) => ref.current?.setStroke(c)}
                  onStrokeWidth={(w) => ref.current?.setStrokeWidth(w)}
                  onDuplicate={() => {
                    ref.current?.duplicateSelected();
                    setTimeout(updateCustomizedSides, 100);
                  }}
                  onForward={() => ref.current?.bringForward()}
                  onBackward={() => ref.current?.sendBackward()}
                  onToggleGrid={() => ref.current?.toggleGrid()}
                  onSetSide={(s) => {
                    ref.current?.setSide(s);
                    setTimeout(updateCustomizedSides, 100);
                  }}
                  productId={selectedProduct}
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
                  products={products}
                  selectedProduct={selectedProduct}
                  onProductChange={setSelectedProduct}
                  productColors={productColors[selectedProduct] || []}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  onSideChange={setActiveSide}
                />
              </div>
            ) : (
              <div className="p-4">
                <StickersPanel
                  onPick={(url) => {
                    ref.current?.addImageFromUrl(url);
                    setTimeout(updateCustomizedSides, 100);
                  }}
                />
              </div>
            )}
          </div>

          {/* Help Section - Fixed at Bottom */}
          <div className="border-t border-brand-gray-light bg-navy-50 p-4 space-y-2">
            <h4 className="text-sm font-semibold text-navy mb-2">
              💡 Besoin d'aide ?
            </h4>
            <p className="text-xs text-brand-gray-dark leading-relaxed">
              • Téléversez votre propre image
              <br />
              • Choisissez un design dans l'onglet "Designs"
              <br />• Besoin de modifications ? Contactez-nous à
              contact@monimpression.com
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

export default function PersonnaliserPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-brand-gray-lighter to-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div></div>}>
      <PersonnaliserContent />
    </Suspense>
  );
}