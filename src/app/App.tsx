import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router/dom'

import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* 개발 서버에서만 보인다. 운영 빌드에서는 빈 컴포넌트로 바뀌어 번들에서 빠진다. */}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
