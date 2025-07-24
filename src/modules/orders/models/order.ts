export interface OrderItem {
  id: string;
  product: string;
  product_name: string;
  product_description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  address_line: string;
  city?: string;
  state?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  status_display: string;
  payment_method: 'qr' | 'card' | 'cash';
  payment_method_display: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_status_display: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  delivery_notes?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
  user: User;
  delivery_address?: DeliveryAddress;
  items: OrderItem[];
  total_items: number;
}

export interface OrderStatusHistory {
  id: string;
  previous_status?: string;
  new_status: string;
  notes?: string;
  changed_by?: User;
  created_at: string;
}

export interface OrdersResponse {
  statusCode: number;
  message: string;
  data: Order[];
}

export interface OrderResponse {
  statusCode: number;
  message: string;
  data: Order;
}

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'orange' },
  { value: 'confirmed', label: 'Confirmado', color: 'blue' },
  { value: 'preparing', label: 'Preparando', color: 'purple' },
  { value: 'ready', label: 'Listo', color: 'cyan' },
  { value: 'delivering', label: 'En camino', color: 'yellow' },
  { value: 'delivered', label: 'Entregado', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'qr', label: 'Código QR' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'cash', label: 'Efectivo' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'orange' },
  { value: 'completed', label: 'Completado', color: 'green' },
  { value: 'failed', label: 'Fallido', color: 'red' },
  { value: 'refunded', label: 'Reembolsado', color: 'gray' },
];
