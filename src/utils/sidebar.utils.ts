import { PrivateRoutes } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { Box, Building2Icon, BuildingIcon, DollarSignIcon, FileText, FlameIcon, FuelIcon, KeyIcon, LogOut, PackageIcon, ScrollTextIcon, ShoppingCart, Tag, Truck, UserCogIcon, UserIcon, UsersIcon } from 'lucide-react'
import { createElement } from 'react'

export interface MenuHeaderRoute {
  path?: string
  label: string
  icon?: JSX.Element
  children?: MenuHeaderRoute[]
  permissions?: PERMISSION[]
}

export const MenuSideBar: MenuHeaderRoute[] = [
  {
    label: 'Gestión de Usuarios',
    icon: createElement(UserCogIcon, { width: 20, height: 20 }),
    path: '/usuarios',
    permissions: [] as PERMISSION[],
    children: [
      {
        path: '/usuarios',
        label: 'Usuarios',
        icon: createElement(UsersIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: '/usuarios/roles',
        label: 'Roles',
        icon: createElement(UserIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: '/usuarios/permisos',
        label: 'Permisos',
        icon: createElement(KeyIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Administrar Empresa',
    icon: createElement(Building2Icon, { width: 20, height: 20 }),
    path: '/empresa',
    permissions: [] as PERMISSION[],
    children: [
      {
        path: PrivateRoutes.COMPANY,
        label: 'Empresa',
        icon: createElement(BuildingIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.BRANCH,
        label: 'Sucursales',
        icon: createElement(FuelIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.BINACLE,
        label: 'Bitácora',
        icon: createElement(ScrollTextIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Inventario',
    icon: createElement(PackageIcon, { width: 20, height: 20 }),
    path: '/productos',
    permissions: [] as PERMISSION[],
    children: [
      {
        path: PrivateRoutes.PRODUCT,
        label: 'Productos',
        icon: createElement(FuelIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.FUEL,
        label: 'Combustibles',
        icon: createElement(FlameIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.GROUP,
        label: 'Grupos y categorias',
        icon: createElement(UsersIcon, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.OUPUT_PRODUCT,
        label: 'Salida de productos',
        icon: createElement(LogOut, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Compras',
    icon: createElement(ShoppingCart, { width: 20, height: 20 }),
    path: '/proveedores',
    permissions: [] as PERMISSION[],
    children: [
      {
        path: PrivateRoutes.PROVIDER,
        label: 'Proveedores',
        icon: createElement(Truck, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.PURCHASE_ORDER,
        label: 'Ordenes de compra',
        icon: createElement(FileText, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.BUY,
        label: 'Compras',
        icon: createElement(ShoppingCart, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Ventas',
    icon: createElement(DollarSignIcon, { width: 20, height: 20 }),
    path: '/ventas',
    permissions: [] as PERMISSION[],
    children: [
      {
        path: PrivateRoutes.DiSPENSER,
        label: 'Dispensador',
        icon: createElement(Box, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.DISCOUNT,
        label: 'Descuentos',
        icon: createElement(Tag, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      },
      {
        path: PrivateRoutes.SALES,
        label: 'Ventas',
        icon: createElement(ShoppingCart, { width: 20, height: 20 }),
        permissions: [] as PERMISSION[]
      }
    ]
  }
]
