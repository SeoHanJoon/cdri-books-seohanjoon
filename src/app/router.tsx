import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/app/RootLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SearchPage } from '@/pages/SearchPage'
import { WishlistPage } from '@/pages/WishlistPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: SearchPage },
      { path: 'wishlist', Component: WishlistPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
