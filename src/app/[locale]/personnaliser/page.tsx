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
import { useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { products, clothingSizes, SizeOption } from "@/data/products";
import { DELIVERY_CONFIG } from "@/data/catalog";
import { useCart } from "@/lib/useCart";
import { calculatePrice, type ProductId } from "@/lib/product-pricing";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ShoppingCart,
} from "lucide-react";

type TariffOption = "oneSide" | "twoSides" | "fullPrint";

export default function PersonnaliserPage() {
  const t = useTranslations("personnaliser");
  const tProducts = useTranslations("products");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"tools" | "stickers">("tools");
  const ref = useRef<CustomizerHandle | null>(null);
  const { addItem, updateItem, addAsset, cart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState("tshirt");
  const [selectedColor, setSelectedColor] = useState("black");
  const [activeSide, setActiveSide] = useState("front");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [customizedSidesCount, setCustomizedSidesCount] = useState(0);
  const [selectedTariff, setSelectedTariff] = useState<TariffOption>("oneSide");
  const [base, setBase] = useState<string>(
    products.find((p) => p.id === selectedProduct)?.defaultImage ||
      "/Products/BlackTShirtFront.png",
  );

  // Update base image when product or color changes
  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct);
    const colors = product?.colors || [];
    if (colors.length > 0) {
      const currentColor =
        colors.find((c) => c.id === selectedColor) || colors[0];
      setBase(
        currentColor.images[activeSide as keyof typeof currentColor.images] ||
          currentColor.images.front,
      );
      if (!colors.find((c) => c.id === selectedColor)) {
        setSelectedColor(colors[0].id);
      }
    } else {
      // Handle size-specific images for products like insulated mugs
      if (product?.id === "mug_insulated" && selectedSize === "small") {
        setBase("/tasses/isothermepetite.png");
      } else {
        setBase(product?.defaultImage || "/Products/BlackTShirtFront.png");
      }
    }
  }, [selectedProduct, selectedColor, activeSide, selectedSize]);

  // Reset size when product changes
  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct);
    if (product?.hasSize && product.sizeOptions) {
      // Set to first size option for products with size variants
      setSelectedSize((product.sizeOptions as SizeOption[])[0].id);
    } else if (product?.isClothing) {
      // Set to M for clothing
      setSelectedSize("M");
    }
    // Reset tariff choice when switching products
    setSelectedTariff("oneSide");
  }, [selectedProduct]);

  // Reset active side when product changes
  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct);
    if (product?.availableSides) {
      setActiveSide(product.availableSides[0]);
    }
  }, [selectedProduct]);

  // track selected item from canvas so toolbox can show editing UI
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);
  // track pan mode for visual indicator in toolbox
  const [panMode, setPanMode] = useState(false);
  // track garment color
  const [garmentColor, setGarmentColor] = useState("#FFFFFF");

  const hasVariablePricing = (product: (typeof products)[number]) =>
    product.pricing.oneSide !== product.pricing.twoSides ||
    product.pricing.oneSide !== product.pricing.fullPrint;

  const tariffSelectionOverrides = new Set(["license_plate"]);

  const shouldUseTariffSelection = (product: (typeof products)[number]) =>
    product.availableSides.length > 1 &&
    !product.hasSize &&
    (hasVariablePricing(product) || tariffSelectionOverrides.has(product.id));

  // Calculate product price only
  const calculateProductPrice = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return 0;

    let basePrice = 0;

    // Explicit tariff selection for eligible products
    if (shouldUseTariffSelection(product)) {
      if (selectedTariff === "twoSides")
        basePrice = product.pricing.twoSides || 0;
      else if (selectedTariff === "fullPrint")
        basePrice = product.pricing.fullPrint || 0;
      else basePrice = product.pricing.oneSide;
    }
    // If product has size-based pricing (like insulated mugs)
    else if (product.hasSize && product.sizeOptions) {
      const sizeOption = (product.sizeOptions as SizeOption[]).find(
        (opt: SizeOption) => opt.id === selectedSize,
      );
      basePrice = sizeOption ? sizeOption.price : product.pricing.oneSide;
    }
    // Standard pricing based on customized sides
    else if (customizedSidesCount === 0 || customizedSidesCount === 1) {
      basePrice = product.pricing.oneSide;
    } else if (customizedSidesCount === 2) {
      basePrice = product.pricing.twoSides || 0;
    } else {
      basePrice = product.pricing.fullPrint || 0;
    }

    return basePrice;
  };

  const currentPrice = calculateProductPrice();

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

    // Check if terms were accepted in this session
    const termsAcceptedInSession = sessionStorage.getItem(
      "personnaliser_terms_accepted",
    );
    if (termsAcceptedInSession === "true") {
      setTermsAccepted(true);
    }
  }, [searchParams]);

  // Update customized sides count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateCustomizedSides();
    }, 500);
    return () => clearInterval(interval);
  }, [selectedProduct, activeSide]);

  // Load edit mode data
  useEffect(() => {
    const editMode = localStorage.getItem("personnaliser_edit_mode");
    const itemId = localStorage.getItem("personnaliser_edit_item_id");

    if (editMode === "true" && itemId) {
      const item = cart.items.find((i) => i.id === itemId);
      if (item && item.customization) {
        setIsEditMode(true);
        setEditingItemId(itemId);

        // Set product and customization from item
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          setSelectedProduct(product.id);
          setSelectedColor(item.customization.color || "black");
          setGarmentColor(item.customization.color || "#FFFFFF");
        }

        // Load canvas state after canvas is ready
        setTimeout(() => {
          if (ref.current && item.customization?.sides) {
            ref.current.loadCanvasState({
              itemsBySide: item.customization.sides,
              garmentColor: item.customization.color || "#FFFFFF",
            });
            // Set to front side if it has items
            if (
              item.customization.sides.front &&
              item.customization.sides.front.length > 0
            ) {
              setActiveSide("front");
            }
          }
        }, 500);

        // Clear edit mode flags
        localStorage.removeItem("personnaliser_edit_mode");
        localStorage.removeItem("personnaliser_edit_item_id");
      }
    }
  }, [cart.items]);

  const addToCart = async () => {
    const canvasState = ref.current?.getCanvasState();
    if (!canvasState) return;

    const customizedSides = Object.keys(canvasState.itemsBySide).filter(
      (side) => canvasState.itemsBySide[side].length > 0,
    );
    if (customizedSides.length === 0) return;

    // Export designs for checkout
    const designs = await ref.current?.exportAllSides();
    if (!designs) return;

    const product = products.find((p) => p.id === selectedProduct);
    let productId: ProductId;
    if (selectedProduct === "tshirt") productId = "tshirt";
    else if (selectedProduct === "hoodie") productId = "hoodie";
    else if (selectedProduct === "mug") productId = "mug_ceramic";
    else productId = "tshirt"; // fallback

    const price = calculateProductPrice();

    // Save uploaded assets to cart storage
    const uploadedAssetIds: string[] = [];
    canvasState.uploadedAssets.forEach((asset) => {
      const assetId = addAsset({
        file: asset.file,
        dataUrl: asset.dataUrl,
        side: asset.side,
      });
      uploadedAssetIds.push(assetId);
    });

    const itemData: Omit<import("@/types").CartItem, "id"> = {
      productId,
      name: tProducts(
        (products.find((p) => p.id === selectedProduct)?.nameKey as string) ||
          "product",
      ),
      price,
      quantity,
      customization: {
        color: canvasState.garmentColor,
        sides: canvasState.itemsBySide,
        uploadedAssets: canvasState.uploadedAssets.map((asset, index) => ({
          id: uploadedAssetIds[index],
          file: asset.file,
          dataUrl: asset.dataUrl,
          side: asset.side,
        })),
        designs,
      },
    };

    if (isEditMode && editingItemId) {
      // Update existing item
      updateItem(editingItemId, itemData);
      setIsEditMode(false);
      setEditingItemId(null);
    } else {
      // Add new item
      addItem(itemData);
    }
  };

  const handleAddToCartClick = async () => {
    const canvasState = ref.current?.getCanvasState();
    if (!canvasState) return;
    const customizedSides = Object.keys(canvasState.itemsBySide).filter(
      (side) => canvasState.itemsBySide[side].length > 0,
    );
    if (customizedSides.length === 0) return;

    // If terms already accepted in this session, proceed directly
    if (termsAccepted) {
      await addToCart();
      router.push("/cart");
    } else {
      setShowTermsModal(true);
    }
  };

  const handleTermsConfirm = async () => {
    setShowTermsModal(false);
    setTermsAccepted(true);
    // Store in session storage
    sessionStorage.setItem("personnaliser_terms_accepted", "true");
    await addToCart();
    router.push("/cart");
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
                {t("title", {
                  product: tProducts(
                    (products.find((p) => p.id === selectedProduct)
                      ?.nameKey as string) || "product",
                  ),
                })}
              </h1>
              <p className="text-sm text-brand-gray-dark mt-1">
                {t("subtitle")}
              </p>
            </div>

            {/* Product Price */}
            <div className="border-t border-brand-gray-light pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-brand-gray-dark">
                  {t("price")}:
                </span>
                <div className="text-right">
                  <div className="text-sm text-brand-gray-dark">
                    Produit: ${calculateProductPrice().toFixed(2)}
                  </div>
                  <div className="text-xl font-bold text-navy border-t border-brand-gray-light pt-1 mt-1">
                    Prix: ${calculateProductPrice().toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-brand-gray-dark">
                  {customizedSidesCount === 0 && t("customization.none")}
                  {customizedSidesCount === 1 && t("customization.oneSide")}
                  {customizedSidesCount === 2 && t("customization.twoSides")}
                  {customizedSidesCount >= 3 && t("customization.fullPrint")}
                </p>
                {(() => {
                  const product = products.find(
                    (p) => p.id === selectedProduct,
                  );
                  if (!product) return null;

                  // Show size-based pricing for products with size options
                  if (product.hasSize && product.sizeOptions) {
                    return (
                      <div className="text-xs text-brand-gray-dark bg-brand-gray-lighter p-2 rounded">
                        <div className="font-medium mb-1">
                          {t("formatsAvailable")}:
                        </div>
                        {(product.sizeOptions as SizeOption[]).map(
                          (sizeOpt: SizeOption) => (
                            <div
                              key={sizeOpt.id}
                              className="flex justify-between"
                            >
                              <span>{sizeOpt.label}:</span>
                              <span>${sizeOpt.price.toFixed(2)}</span>
                            </div>
                          ),
                        )}
                      </div>
                    );
                  }

                  const showTariffSelector = shouldUseTariffSelection(product);

                  // Determine available tariff options based on number of sides
                  const maxSides = product.availableSides.length;
                  const tariffOptions = [
                    {
                      id: "oneSide" as TariffOption,
                      label: "pricing.options.oneSide",
                    },
                    ...(maxSides >= 2
                      ? [
                          {
                            id: "twoSides" as TariffOption,
                            label: "pricing.options.twoSides",
                          },
                        ]
                      : []),
                    ...(maxSides >= 3
                      ? [
                          {
                            id: "fullPrint" as TariffOption,
                            label: "pricing.options.fullPrint",
                          },
                        ]
                      : []),
                  ];

                  // Show customization-based pricing
                  return (
                    <div className="text-xs text-brand-gray-dark bg-brand-gray-lighter p-2 rounded">
                      <div className="font-medium mb-2">
                        {t("pricing.title")}:
                      </div>
                      {showTariffSelector ? (
                        <div className="space-y-2">
                          {tariffOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedTariff(opt.id)}
                              className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-left transition-all ${
                                selectedTariff === opt.id
                                  ? "border-navy bg-white shadow-sm"
                                  : "border-brand-gray-light hover:border-navy-light hover:bg-white"
                              }`}
                            >
                              <span>{t(opt.label)}</span>
                              <span className="font-semibold">
                                ${product.pricing[opt.id]!.toFixed(2)}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <>
                          {tariffOptions.map((opt) => (
                            <div key={opt.id} className="flex justify-between">
                              <span>{t(opt.label)}:</span>
                              <span>
                                ${product.pricing[opt.id]!.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Size and Quantity Selection */}
            <div className="border-t border-brand-gray-light pt-4">
              <div className="flex gap-2">
                {/* Size Selection for Clothing or Accessories with sizes */}
                {(() => {
                  const currentProduct = products.find(
                    (p) => p.id === selectedProduct,
                  );
                  if (currentProduct?.isClothing) {
                    return (
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-brand-gray-dark mb-2">
                          {t("size")}:
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
                    );
                  } else if (
                    currentProduct?.hasSize &&
                    currentProduct?.sizeOptions
                  ) {
                    return (
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-brand-gray-dark mb-2">
                          {t("format")}:
                        </label>
                        <select
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full border border-brand-gray-light rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
                        >
                          {currentProduct.sizeOptions.map(
                            (sizeOpt: SizeOption) => (
                              <option key={sizeOpt.id} value={sizeOpt.id}>
                                {sizeOpt.label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Quantity Selection */}
                <div
                  className={
                    products.find((p) => p.id === selectedProduct)
                      ?.isClothing ||
                    products.find((p) => p.id === selectedProduct)?.hasSize
                      ? "w-28"
                      : "flex-1"
                  }
                >
                  <label className="block text-xs font-medium text-brand-gray-dark mb-2">
                    {t("quantity")}:
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

            {/* Action Buttons */}
            <div className="border-t border-brand-gray-light pt-4 space-y-3">
              <button
                onClick={handleAddToCartClick}
                disabled={customizedSidesCount === 0 || loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-navy to-navy-light hover:from-navy-dark hover:to-navy text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {loading ? t("loading") : t("addToCart")}
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
              selectedColor={selectedColor}
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
                  onExport={() => {}}
                  products={products.map((p) => ({
                    ...p,
                    name: tProducts(p.nameKey),
                  }))}
                  selectedProduct={selectedProduct}
                  onProductChange={setSelectedProduct}
                  productColors={
                    products.find((p) => p.id === selectedProduct)?.colors || []
                  }
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
              {t("helpTitle")}
            </h4>
            <p className="text-xs text-brand-gray-dark leading-relaxed">
              {t("help.upload")}
              <br />
              {t("help.designs")}
              <br />
              {t("help.contact")}
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
