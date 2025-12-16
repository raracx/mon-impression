import { useState, useEffect } from "react";
import { CartItem, Cart, UploadedAsset } from "@/types";

const CART_STORAGE_KEY = "sitewebguy_cart";
const ASSETS_STORAGE_KEY = "sitewebguy_assets";

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [assets, setAssets] = useState<UploadedAsset[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }

    const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (storedAssets) {
      try {
        setAssets(JSON.parse(storedAssets));
      } catch (error) {
        console.error("Failed to parse assets from localStorage:", error);
      }
    }
  }, []);

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const saveAssets = (newAssets: UploadedAsset[]) => {
    setAssets(newAssets);
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
  };

  const addItem = (item: Omit<CartItem, "id">) => {
    const newItem: CartItem = { ...item, id: Date.now().toString() };
    const newCart = { items: [...cart.items, newItem] };
    saveCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = { items: cart.items.filter((item) => item.id !== id) };
    saveCart(newCart);
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    const newCart = {
      items: cart.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    };
    saveCart(newCart);
  };

  const clearCart = () => {
    const newCart = { items: [] };
    saveCart(newCart);
  };

  const getTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const addAsset = (asset: Omit<UploadedAsset, "id">) => {
    const newAsset: UploadedAsset = { ...asset, id: Date.now().toString() };
    const newAssets = [...assets, newAsset];
    saveAssets(newAssets);
    return newAsset.id;
  };

  const removeAsset = (id: string) => {
    const newAssets = assets.filter((asset) => asset.id !== id);
    saveAssets(newAssets);
  };

  const getAsset = (id: string) => {
    return assets.find((asset) => asset.id === id);
  };

  return {
    cart,
    assets,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    getTotal,
    addAsset,
    removeAsset,
    getAsset,
  };
}
