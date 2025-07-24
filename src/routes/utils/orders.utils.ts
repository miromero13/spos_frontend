import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

const OrdersPage = lazy(() => import('@/modules/orders'))

export const orderRoutes: Route[] = [
  {
    path: PrivateRoutes.ORDERS,
    element: createElement(OrdersPage),
    permissions: [] as PERMISSION[]
  }
]
