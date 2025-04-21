import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

export enum PublicRoutes {
  LOGIN = '/login',
  RESET_PASSWORD = '/reset-password',
}

export enum PrivateRoutes {
  DASHBOARD = '/',
  // users
  USER = '/usuarios',
  USER_CREATE = '/usuarios/crear',
  USER_EDIT = '/usuarios/:id',

  // customers
  CUSTOMER = '/clientes',
  CUSTOMER_CREATE = '/clientes/crear',
  CUSTOMER_EDIT = '/clientes/:id',

  // products
  PRODUCT = '/productos',
  PRODUCT_CREATE = '/productos/crear',
  PRODUCT_EDIT = '/productos/:id',

  // cashes
  CASH = '/cajas',
  CASH_CONTROL = '/cajas/control'
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
