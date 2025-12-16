"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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

export default function AdminPage() {
  const t = useTranslations("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">{t("table.date")}</th>
              <th className="p-3">{t("table.customer")}</th>
              <th className="p-3">{t("table.amount")}</th>
              <th className="p-3">Livraison</th>
              <th className="p-3">{t("table.status")}</th>
              <th className="p-3">{t("table.design")}</th>
              <th className="p-3"></th>
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
              let deliveryInfo: {
                type: string;
                price: number;
                address?: { city: string; province: string };
              } = { type: "pickup", price: 0 };
              try {
                if (o.shipping_address) {
                  deliveryInfo = JSON.parse(o.shipping_address);
                }
              } catch (e) {
                console.error("Failed to parse delivery info:", e);
              }

              return (
                <tr key={o.id} className="border-t">
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
                        {deliveryInfo.type === "pickup"
                          ? "📦 Pickup"
                          : "🚚 Delivery"}
                      </div>
                      {deliveryInfo.type === "delivery" && (
                        <div className="text-gray-600">
                          ${deliveryInfo.price?.toFixed(2) || "0.00"}
                          {deliveryInfo.address && (
                            <div className="mt-1">
                              {deliveryInfo.address.city},{" "}
                              {deliveryInfo.address.province}
                            </div>
                          )}
                        </div>
                      )}
                      {deliveryInfo.type === "pickup" && (
                        <div className="text-gray-600">Free</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">
                    {o.design_url ? (
                      <a
                        href={o.design_url}
                        target="_blank"
                        className="text-slate-900 underline"
                      >
                        {t("download")}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="btn-primary"
                        onClick={() => setStatus(o.id, "fulfilled")}
                      >
                        {t("markFulfilled")}
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => setStatus(o.id, "failed")}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
