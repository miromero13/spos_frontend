import React, { useState } from 'react';
import OrderList from './OrderList';
import CustomerLocationMap from './CustomerLocationMap';
import { Order } from '../models/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, User, CreditCard, MapPin, DollarSign } from 'lucide-react';

const OrdersModule: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {!selectedOrder ? (
          <OrderList onOrderClick={handleOrderClick} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleCloseDetails}
                className="text-light-text-primary dark:text-dark-text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la lista
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Orden #{selectedOrder.order_number}</span>
                  <Badge variant={getStatusVariant(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Información de la orden
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">Estado:</span>
                          <Badge variant={getStatusVariant(selectedOrder.status)}>
                            {getStatusText(selectedOrder.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">Método de pago:</span>
                          <span className="text-light-text-primary dark:text-dark-text-primary flex items-center">
                            <CreditCard className="h-3 w-3 mr-1" />
                            {selectedOrder.payment_method_display}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">Total:</span>
                          <span className="font-medium text-light-text-primary dark:text-dark-text-primary flex items-center">
                            {/* <DollarSign className="h-3 w-3 mr-1" /> */}
                            Bs. {selectedOrder.total_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Cliente
                      </h4>
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <p>{selectedOrder.user.name}</p>
                        <p>{selectedOrder.user.email}</p>
                        <p>{selectedOrder.user.phone}</p>
                      </div>
                    </div>

                    {selectedOrder.delivery_address && (
                      <div>
                        <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Dirección de entrega
                        </h4>
                        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                          <p>{selectedOrder.delivery_address.address_line}</p>
                          <p>{selectedOrder.delivery_address.city}</p>
                          {selectedOrder.delivery_address.notes && (
                            <p className="mt-1 italic">Notas: {selectedOrder.delivery_address.notes}</p>
                          )}
                        </div>
                        
                        {/* Mapa de ubicación */}
                        {selectedOrder.delivery_address.latitude && selectedOrder.delivery_address.longitude && (
                          <div className="mt-4">
                            <div className="text-sm font-medium mb-2">Ubicación en el mapa:</div>
                            <CustomerLocationMap
                              latitude={selectedOrder.delivery_address.latitude}
                              longitude={selectedOrder.delivery_address.longitude}
                              address={`${selectedOrder.delivery_address.address_line}, ${selectedOrder.delivery_address.city}`}
                              customerName={selectedOrder.user.name}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
                    Productos ({selectedOrder.items.length} items)
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-light-border dark:border-dark-border last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            Cantidad: {item.quantity} × ${item.unit_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            Bs. {item.total_price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
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
  }

  function getStatusText(status: string) {
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
  }
};

export default OrdersModule;
