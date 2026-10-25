import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/Home'
import { NotFoundPage } from '@/pages/NotFound'
import { PRODUCT_SLUGS } from '@/data/slugs'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'shop',
        lazy: async () => {
          const { ShopPage } = await import('@/pages/Shop')
          return { Component: ShopPage }
        },
      },
      {
        path: 'product/:slug',
        lazy: async () => {
          const { ProductPage } = await import('@/pages/Product')
          return { Component: ProductPage }
        },
        getStaticPaths: () => PRODUCT_SLUGS.map((slug) => `product/${slug}`),
      },
      {
        path: 'meal-plan',
        lazy: async () => {
          const { MealPlanPage } = await import('@/pages/MealPlan')
          return { Component: MealPlanPage }
        },
      },
      {
        path: 'about',
        lazy: async () => {
          const { AboutPage } = await import('@/pages/About')
          return { Component: AboutPage }
        },
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export default routes
