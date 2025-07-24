import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../models/order';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, User, DollarSign, Clock } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';

interface OrderListProps {
  onOrderClick?: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ onOrderClick }) => {
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusVariants = {
      'pending': 'outline' as const,
      'confirmed': 'secondary' as const,
      'preparing': 'default' as const,
      'ready': 'secondary' as const,
      'delivering': 'default' as const,
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
      'delivering': 'En Camino',
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-4">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            <Package className="inline-block w-6 h-6 mr-2" />
            Órdenes
          </CardTitle>
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Total: {orders.length} órdenes
          </div>
        </div>
      </CardHeader>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-light-text-secondary dark:text-dark-text-secondary mb-4" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary">No hay órdenes disponibles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                      Orden #{order.order_number}
                    </h3>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="confirmed">Confirmada</SelectItem>
                          <SelectItem value="preparing">Preparando</SelectItem>
                          <SelectItem value="ready">Lista</SelectItem>
                          <SelectItem value="delivering">En Camino</SelectItem>
                          <SelectItem value="delivered">Entregada</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOrderClick(order)}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Cliente: {order.user.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <DollarSign className="h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary" /> */}
                    <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Bs. {order.total_amount}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>

                {order.delivery_address && (
                  <div className="mt-3 flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary mt-0.5" />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {order.delivery_address.address_line}, {order.delivery_address.city}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default OrderList;
