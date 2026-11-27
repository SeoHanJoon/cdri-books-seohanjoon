import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/app/RootLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SearchPage } from '@/pages/SearchPage'
import { WishlistPage } from '@/pages/WishlistPage'

// 라우터는 React 트리 밖에서 한 번만 만든다. (React Router 데이터 모드 권장 방식)
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: SearchPage },
      { path: 'wishlist', Component: WishlistPage },
      // 정의하지 않은 모든 경로. RootLayout 안에 두어 Header가 유지된다. (ADR 0010)
      { path: '*', Component: NotFoundPage },
    ],
  },
])
