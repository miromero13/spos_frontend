import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

export enum PublicRoutes {
  LOGIN = '/login',
  RESET_PASSWORD = '/reset-password',
}

export enum PrivateRoutes {
  DASHBOARD = '/',

  // workspaces
  WORKSPACE = '/workspace/:id',

  SETTINGS = '/configuracion',
  // users
  USER = '/usuarios',
  PROFILE = PrivateRoutes.USER + '/perfil',
  PROFILE_UPDATE = PrivateRoutes.PROFILE + '/editar',
  USER_CREAR = PrivateRoutes.USER + '/crear',
  USER_EDIT = PrivateRoutes.USER + '/:id',
  ROLES = PrivateRoutes.USER + '/roles',
  ROLE_FORM = PrivateRoutes.ROLES + '/crear',
  ROLE_EDIT = PrivateRoutes.ROLES + '/:id',
  PERMISSIONS = PrivateRoutes.USER + '/permisos',
  PERMISSIONS_CREATE = PrivateRoutes.PERMISSIONS + '/crear',
  PERMISSIONS_EDIT = PrivateRoutes.PERMISSIONS + '/:id',
  // company
  COMPANY = '/empresa',
  BRANCH = PrivateRoutes.COMPANY + '/sucursales',
  BRANCH_CREATE = PrivateRoutes.BRANCH + '/crear',
  BINACLE = PrivateRoutes.COMPANY + '/bitacora',
  REPORTS = PrivateRoutes.COMPANY + '/reportes',
  // inventory
  PRODUCT = '/productos',
  PRODUCT_ADD = PrivateRoutes.PRODUCT + '/crear',
  PRODCUT_EDIT = PrivateRoutes.PRODUCT + '/:id',
  PRODUCT_DETAILS = PrivateRoutes.PRODUCT + '/:id/detalles',
  BATCH_CREATE = PrivateRoutes.PRODCUT_EDIT + '/lotes/crear',
  FUEL = PrivateRoutes.PRODUCT + '/combustibles',
  FUEL_ADD = PrivateRoutes.PRODUCT + '/combustibles/crear',
  FUEL_EDIT = PrivateRoutes.PRODUCT + '/combustibles/:id',
  CATEGORY = PrivateRoutes.PRODUCT + '/categorias',
  CATEGORY_CREAR = PrivateRoutes.CATEGORY + '/crear',
  CATEGORY_EDIT = PrivateRoutes.CATEGORY + '/:id',
  GROUP = PrivateRoutes.PRODUCT + '/grupos-y-categorias',
  OUPUT_PRODUCT = PrivateRoutes.PRODUCT + '/salida-productos',
  OUPUT_PRODUCT_CREAR = PrivateRoutes.OUPUT_PRODUCT + '/crear',
  OUPUT_PRODUCT_EDIT = PrivateRoutes.OUPUT_PRODUCT + '/:id',
  OUPUT_DETAIL = PrivateRoutes.OUPUT_PRODUCT + '/:id' + '/detalles',
  // Buys
  BUY = '/compras',
  BUY_CREATE = PrivateRoutes.BUY + '/crear',
  BUY_EDIT = PrivateRoutes.BUY + '/:id',
  BUY_DETAILS = PrivateRoutes.BUY + '/:id',
  PROVIDER = PrivateRoutes.BUY + '/proveedores',
  PROVIDER_CREATE = PrivateRoutes.PROVIDER + '/crear',
  PROVIDER_EDIT = PrivateRoutes.PROVIDER + '/:id',
  PROVIDERPRODUCT = PrivateRoutes.PROVIDER + '/proveedores&productos',
  PROVIDER_DETAILS = PrivateRoutes.PROVIDERPRODUCT + '/:id/detalles',
  PROVIDER_PRODUCT_CREATE = PrivateRoutes.PROVIDERPRODUCT + '/:idProvider/asignar',
  PROVIDER_PRODUCT_EDIT = PrivateRoutes.PROVIDERPRODUCT + '/:idProvider/editar/:id',
  PURCHASE_ORDER = PrivateRoutes.BUY + '/ordenes-de-compras',
  PURCHASE_ORDER_CREATE = PrivateRoutes.PURCHASE_ORDER + '/crear',
  PURCHASE_ORDER_EDIT = PrivateRoutes.PURCHASE_ORDER + '/:id',
  PURCHASE_ORDER_DETAIL = PrivateRoutes.PURCHASE_ORDER + '/:id' + '/detalles',
  // Sales
  SALES = '/ventas',
  SALES_DETAILS = PrivateRoutes.SALES + '/:id' + '/detalles',
  SALES_CREATE = PrivateRoutes.SALES + '/crear',
  SALES_CREATE_FUEL = PrivateRoutes.SALES + '/combustible/:id',
  SALES_CREATE_NOT_FUEL = PrivateRoutes.SALES + '/producto',
  DiSPENSER = PrivateRoutes.SALES + '/dispensador',
  DISPENSER_DETAILS = PrivateRoutes.DiSPENSER + '/:id' + '/detalles',
  DiSPENSER_CREATE = PrivateRoutes.DiSPENSER + '/crear',
  DISPENSER_EDIT = PrivateRoutes.DiSPENSER + '/:id',
  DISCOUNT = PrivateRoutes.DiSPENSER + '/descuentos',
  DISCOUNT_CREATE = PrivateRoutes.DISCOUNT + '/crear',
  DISCOUNT_EDIT = PrivateRoutes.DISCOUNT + '/:id',
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
