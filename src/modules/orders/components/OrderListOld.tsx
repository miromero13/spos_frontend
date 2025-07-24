import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../models/order';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, User, DollarSign } from 'lucide-react';

interface OrderListProps {
  onOrderClick?: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ onOrderClick }) => {
  const { orders, loading, error, updateOrderStatus } = useOrders();

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusVariants = {
      'pending': 'outline' as const,
      'confirmed': 'secondary' as const,
      'preparing': 'default' as const,
      'ready': 'secondary' as const,
      'out_for_delivery': 'default' as const,
      'delivered': 'secondary' as const,
      'cancelled': 'destructive' as const,
    };
    return statusVariants[status as keyof typeof statusVariants] || 'outline';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'preparing': 'Preparando',
      'ready': 'Lista',
      'out_for_delivery': 'En Camino',
      'delivered': 'Entregada',
      'cancelled': 'Cancelada',
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold light:text-gray-900">Órdenes</h2>
        <div className="text-sm text-gray-500">
          Total: {orders.length} órdenes
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay órdenes disponibles</p>
        </div>
      ) : (
        <div className="light:bg-white dark:bg-dark-bg-secondary shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        Orden #{order.order_number}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex dark:text-light-text-secondary">
                        <p className="flex items-center text-sm">
                          Cliente: {order.user.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm sm:mt-0 sm:ml-6">
                          Total: ${order.total_amount}
                        </p>
                        <p className="mt-2 flex items-center text-sm sm:mt-0 sm:ml-6">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm dark:text-light-text-secondary">
                        {order.delivery_address && (
                          <>Dirección: {order.delivery_address.address_line}, {order.delivery_address.city}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="preparing">Preparando</option>
                        <option value="ready">Lista</option>
                        <option value="out_for_delivery">En Camino</option>
                        <option value="delivered">Entregada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    )}
                    {onOrderClick && (
                      <button
                        onClick={() => onOrderClick(order)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Ver detalles
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderList;
