export interface DeliveryDetails {
  type: "delivery" | "pickup";
  price: number;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
}

export interface CanvasItem {
  id: string;
  type: "text" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  // For text
  text?: string;
  fill?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: "normal" | "bold" | "italic" | "bold italic";
  align?: "left" | "center" | "right";
  stroke?: string;
  strokeWidth?: number;
  // For images
  src?: string;
  source?: "upload" | "library";
}

export interface UploadedAsset {
  id: string;
  file: File;
  dataUrl: string;
  side: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    designs: Record<string, string>;
    sides: string[];
    size?: string;
    color?: string;
    tariff?: string;
  };
}

export interface Order {
  id: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  delivery: DeliveryDetails;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  created_at: string;
  updated_at?: string;
}

export interface ShippingConfig {
  standardPrice: number;
  freeShippingThreshold: number;
  pickupAddress: {
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    hours?: string;
  };
}

export interface OrderConfirmationEmailDetails {
  orderId: string;
  productName: string;
  quantity: number;
  amount: number;
  customizedSides: string[];
  delivery?: DeliveryDetails;
  locale: "en" | "fr";
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    color?: string;
    sides: string[];
    designs?: Record<string, string>;
  }>;
  subtotal?: number;
  deliveryFee?: number;
}

export interface AdminNotificationEmailDetails {
  orderId: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  amount: number;
  designs: Record<string, string>;
  customizedSides: string[];
  rawAssets?: {
    userUploads: Array<{ id: string; src: string; side: string }>;
    libraryAssets: Array<{ id: string; src: string; side: string }>;
  };
  size?: string;
  color?: string;
  paymentStatus?: string;
  delivery?: DeliveryDetails;
  locale: "en" | "fr";
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    color: string;
    sides: Record<string, CanvasItem[]>;
    uploadedAssets: UploadedAsset[];
    designs?: Record<string, string>;
  };
}

export interface Cart {
  items: CartItem[];
}
