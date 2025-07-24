import React from 'react';
import { Order } from '../models/order';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, User, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomerLocationMap from './CustomerLocationMap';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, 
  isOpen, 
  onClose 
}) => {
  if (!order) return null;

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

  const getPaymentMethodText = (method: string) => {
    const methods = {
      'qr': 'Código QR',
      'card': 'Tarjeta',
      'cash': 'Efectivo',
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Detalles de Orden #{order.order_number}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado y información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Estado:</span>
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    Bs. {order.total_amount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getPaymentMethodText(order.payment_method)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Cliente:</strong> {order.user.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Fecha:</strong> {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} × Bs. {item.unit_price}
                      </div>
                    </div>
                    <div className="font-semibold">
                      Bs. {item.total_price.toFixed(2)}
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>Bs. {order.total_amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección de entrega y mapa */}
          {order.delivery_address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Dirección de Entrega</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="font-medium mb-2">
                    {order.delivery_address.address_line}
                  </div>
                  <div className="text-muted-foreground">
                    {order.delivery_address.city}
                    {order.delivery_address.notes && (
                      <div className="mt-1">
                        <strong>Notas:</strong> {order.delivery_address.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mapa */}
                {order.delivery_address.latitude && order.delivery_address.longitude && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Ubicación en el mapa:</div>
                    <CustomerLocationMap
                      latitude={order.delivery_address.latitude}
                      longitude={order.delivery_address.longitude}
                      address={`${order.delivery_address.address_line}, ${order.delivery_address.city}`}
                      customerName={order.user.name}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
