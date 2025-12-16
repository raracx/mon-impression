"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Order = {
  id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  design_url?: string | null;
  shipping_address?: string | null;
  created_at: string;
};

type DesignData = {
  designs: Record<string, string>;
  customizedSides: string[];
  sidesCount: number;
  productId: string;
  size?: string;
  quantity?: number;
  color?: string;
  description?: string;
  name?: string;
  rawAssets?: {
    userUploads: Array<{ id: string; src: string; side: string }>;
    libraryAssets: Array<{ id: string; src: string; side: string }>;
  };
};

type DeliveryData = {
  type: "delivery" | "pickup";
  price: number;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    notes?: string;
  } | null;
  productPrice: number;
  totalAmount: number;
};

export default function AdminPage() {
  const t = useTranslations("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const json = await res.json();
    setOrders(json.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const parseDesignData = (
    designUrl: string | null | undefined,
  ): DesignData | null => {
    if (!designUrl) return null;
    try {
      return JSON.parse(designUrl);
    } catch (e) {
      console.error("Failed to parse design data:", e);
      return null;
    }
  };

  const parseDeliveryData = (
    shippingAddress: string | null | undefined,
  ): DeliveryData | null => {
    if (!shippingAddress) return null;
    try {
      return JSON.parse(shippingAddress);
    } catch (e) {
      console.error("Failed to parse delivery data:", e);
      return null;
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const downloadDesign = (
    designData: Record<string, string>,
    orderId: string,
    side: string,
  ) => {
    const dataUrl = designData[side];
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `order-${orderId}-${side}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllDesigns = (
    designData: Record<string, string>,
    orderId: string,
  ) => {
    Object.keys(designData).forEach((side) => {
      setTimeout(() => downloadDesign(designData, orderId, side), 100);
    });
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Details</th>
              <th className="p-3">{t("table.date")}</th>
              <th className="p-3">{t("table.customer")}</th>
              <th className="p-3">{t("table.amount")}</th>
              <th className="p-3">Livraison</th>
              <th className="p-3">{t("table.status")}</th>
              <th className="p-3">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3" colSpan={7}>
                  {t("loading")}
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const designData = parseDesignData(o.design_url);
              const deliveryData = parseDeliveryData(o.shipping_address);
              const isExpanded = expandedOrder === o.id;

              return (
                <>
                  <tr key={o.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <button
                        onClick={() => toggleExpand(o.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {isExpanded ? "▼" : "▶"}
                      </button>
                    </td>
                    <td className="p-3">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">{o.email}</td>
                    <td className="p-3">
                      {(o.amount / 100).toFixed(2)} {o.currency.toUpperCase()}
                    </td>
                    <td className="p-3">
                      <div className="text-xs">
                        <div className="font-medium">
                          {deliveryData?.type === "pickup"
                            ? "📦 Pickup"
                            : "🚚 Delivery"}
                        </div>
                        {deliveryData?.type === "delivery" && (
                          <div className="text-gray-600">
                            ${deliveryData.price?.toFixed(2) || "0.00"}
                            {deliveryData.address && (
                              <div className="mt-1">
                                {deliveryData.address.city},{" "}
                                {deliveryData.address.province}
                              </div>
                            )}
                          </div>
                        )}
                        {deliveryData?.type === "pickup" && (
                          <div className="text-gray-600">Free</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          o.status === "fulfilled"
                            ? "bg-green-100 text-green-800"
                            : o.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="btn-primary text-xs px-2 py-1"
                          onClick={() => setStatus(o.id, "fulfilled")}
                          disabled={o.status === "fulfilled"}
                        >
                          {t("markFulfilled")}
                        </button>
                        <button
                          className="btn-primary text-xs px-2 py-1 bg-red-600 hover:bg-red-700"
                          onClick={() => setStatus(o.id, "failed")}
                          disabled={o.status === "failed"}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-t bg-slate-50">
                      <td colSpan={7} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Print Details */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 text-slate-800">
                              📋 Print Details
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">
                                  Product ID:
                                </span>
                                <span className="font-medium">
                                  {designData?.productId || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-medium">
                                  {designData?.quantity || 1}
                                </span>
                              </div>
                              {designData?.size && (
                                <div className="flex justify-between py-2 border-b">
                                  <span className="text-gray-600">Size:</span>
                                  <span className="font-medium">
                                    {designData.size}
                                  </span>
                                </div>
                              )}
                              {designData?.color && (
                                <div className="flex justify-between py-2 border-b">
                                  <span className="text-gray-600">Color:</span>
                                  <span className="font-medium capitalize">
                                    {designData.color}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">
                                  Customized Sides:
                                </span>
                                <span className="font-medium">
                                  {designData?.customizedSides?.join(", ") ||
                                    "front"}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">
                                  Sides Count:
                                </span>
                                <span className="font-medium">
                                  {designData?.sidesCount || 1}
                                </span>
                              </div>
                              {designData?.name && (
                                <div className="flex justify-between py-2 border-b">
                                  <span className="text-gray-600">Name:</span>
                                  <span className="font-medium">
                                    {designData.name}
                                  </span>
                                </div>
                              )}
                              {designData?.description && (
                                <div className="py-2 border-b">
                                  <span className="text-gray-600 block mb-1">
                                    Description:
                                  </span>
                                  <span className="font-medium">
                                    {designData.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Delivery Information */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 text-slate-800">
                              🚚 Delivery Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium capitalize">
                                  {deliveryData?.type || "pickup"}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">
                                  Delivery Fee:
                                </span>
                                <span className="font-medium">
                                  ${deliveryData?.price?.toFixed(2) || "0.00"}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">
                                  Product Price:
                                </span>
                                <span className="font-medium">
                                  $
                                  {deliveryData?.productPrice?.toFixed(2) ||
                                    "0.00"}
                                </span>
                              </div>
                              {deliveryData?.address && (
                                <>
                                  <div className="py-2 border-b">
                                    <span className="text-gray-600 block mb-1">
                                      Address:
                                    </span>
                                    <div className="font-medium space-y-1">
                                      <div>{deliveryData.address.street}</div>
                                      <div>
                                        {deliveryData.address.city},{" "}
                                        {deliveryData.address.province}
                                      </div>
                                      <div>
                                        {deliveryData.address.postalCode}
                                      </div>
                                      <div>{deliveryData.address.country}</div>
                                    </div>
                                  </div>
                                  {deliveryData.address.notes && (
                                    <div className="py-2 border-b">
                                      <span className="text-gray-600 block mb-1">
                                        Delivery Notes:
                                      </span>
                                      <span className="font-medium">
                                        {deliveryData.address.notes}
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Design Assets */}
                          {designData?.designs && (
                            <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg text-slate-800">
                                  🎨 Design Assets
                                </h3>
                                <button
                                  onClick={() =>
                                    downloadAllDesigns(designData.designs, o.id)
                                  }
                                  className="btn-primary text-xs px-3 py-1"
                                >
                                  Download All
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(designData.designs).map(
                                  ([side, dataUrl]) => (
                                    <div
                                      key={side}
                                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                                    >
                                      <div className="font-medium text-sm mb-2 capitalize text-slate-700">
                                        {side}
                                      </div>
                                      <div className="relative aspect-square bg-gray-100 rounded overflow-hidden mb-2">
                                        <Image
                                          src={dataUrl}
                                          alt={`${side} design`}
                                          fill
                                          className="object-contain"
                                        />
                                      </div>
                                      <button
                                        onClick={() =>
                                          downloadDesign(
                                            designData.designs,
                                            o.id,
                                            side,
                                          )
                                        }
                                        className="w-full btn-primary text-xs py-1"
                                      >
                                        Download {side}
                                      </button>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {/* Raw Assets Section */}
                          {designData?.rawAssets &&
                            (designData.rawAssets.userUploads.length > 0 ||
                              designData.rawAssets.libraryAssets.length >
                                0) && (
                              <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
                                <h3 className="font-semibold text-lg mb-4 text-slate-800">
                                  📦 Raw Assets Breakdown
                                </h3>
                                <div className="space-y-4">
                                  {/* User Uploads */}
                                  {designData.rawAssets.userUploads.length >
                                    0 && (
                                    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                        <span>👤</span>
                                        User Uploaded Assets (
                                        {
                                          designData.rawAssets.userUploads
                                            .length
                                        }
                                        )
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {designData.rawAssets.userUploads.map(
                                          (asset, index) => (
                                            <div
                                              key={asset.id}
                                              className="bg-white border border-red-200 rounded p-2"
                                            >
                                              <div className="text-xs font-medium text-red-700 mb-1">
                                                USER-UPLOAD-{index + 1}
                                              </div>
                                              <div className="text-xs text-gray-600 mb-2">
                                                Used on: {asset.side}
                                              </div>
                                              <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                                                <Image
                                                  src={asset.src}
                                                  alt={`User upload ${index + 1}`}
                                                  fill
                                                  className="object-contain"
                                                />
                                              </div>
                                              <button
                                                onClick={() => {
                                                  const link =
                                                    document.createElement("a");
                                                  link.href = asset.src;
                                                  link.download = `USER-UPLOAD-${index + 1}-${asset.side}.png`;
                                                  link.click();
                                                }}
                                                className="w-full mt-2 btn-primary text-xs py-1"
                                              >
                                                Download
                                              </button>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                      <p className="mt-3 text-xs text-red-700 bg-red-100 p-2 rounded">
                                        ⚠️ Customer-provided images. Verify
                                        image quality and copyright compliance.
                                      </p>
                                    </div>
                                  )}

                                  {/* Library Assets */}
                                  {designData.rawAssets.libraryAssets.length >
                                    0 && (
                                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                        <span>📚</span>
                                        Platform Library Assets (
                                        {
                                          designData.rawAssets.libraryAssets
                                            .length
                                        }
                                        )
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {designData.rawAssets.libraryAssets.map(
                                          (asset, index) => (
                                            <div
                                              key={asset.id}
                                              className="bg-white border border-blue-200 rounded p-2"
                                            >
                                              <div className="text-xs font-medium text-blue-700 mb-1">
                                                LIBRARY-ASSET-{index + 1}
                                              </div>
                                              <div className="text-xs text-gray-600 mb-1">
                                                Used on: {asset.side}
                                              </div>
                                              <div className="text-xs text-gray-500 mb-2 break-all">
                                                Path:{" "}
                                                {asset.src.replace(
                                                  /^\/api\/img\?url=/,
                                                  "",
                                                )}
                                              </div>
                                              <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                                                <Image
                                                  src={asset.src}
                                                  alt={`Library asset ${index + 1}`}
                                                  fill
                                                  className="object-contain"
                                                />
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                      <p className="mt-3 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                        ℹ️ These are pre-approved graphics from
                                        the platform library.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
