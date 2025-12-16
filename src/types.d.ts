export interface DeliveryDetails {
  type: 'delivery' | 'pickup';
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
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
