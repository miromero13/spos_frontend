import { fetchData } from '@/utils';
import { buildUrl, ENDPOINTS } from '@/utils/api.utils';
import { Order } from '../models/order';

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    try {
      const url = buildUrl({ endpoint: ENDPOINTS.ORDERS });
      const response = await fetchData(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async getOrderById(id: string): Promise<Order> {
    try {
      const url = buildUrl({ endpoint: ENDPOINTS.ORDERS, id });
      const response = await fetchData(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  static async updateOrderStatus(id: string, status: string): Promise<Order> {
    try {
      const url = buildUrl({ endpoint: `${ENDPOINTS.ORDERS}${id}/` });
      const options: RequestInit = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      };
      const response = await fetchData(url, options);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  static async getOrderStatusHistory(id: string): Promise<any[]> {
    try {
      const url = buildUrl({ endpoint: `${ENDPOINTS.ORDERS}${id}/status_history/` });
      const response = await fetchData(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching order status history:', error);
      throw error;
    }
  }
}
