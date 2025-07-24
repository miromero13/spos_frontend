// Componente principal
export { default } from './components/OrdersModule';

// Otros componentes
export { default as OrderList } from './components/OrderList';

// Modelos
export * from './models/order';

// Servicios
export { OrderService } from './services/order.service';

// Hooks
export { useOrders } from './hooks/useOrders';
