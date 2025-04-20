import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const ProductPage = lazy(() => import('@modules/sales/pages/products'))
const ProductFormPage = lazy(() => import('@modules/sales/pages/products/components/product-form'))

export const productRoutes: Route[] = [
  {
    path: PrivateRoutes.PRODUCT,
    element: createElement(ProductPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PRODUCT_CREATE,
    element: createElement(ProductFormPage, { buttonText: 'Guardar Producto', title: 'Crear Producto' }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PRODUCT_EDIT,
    element: createElement(ProductFormPage, { buttonText: 'Actualizar Producto', title: 'Editar Producto' }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  }
]
