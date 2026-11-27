import { QueryClient } from '@tanstack/react-query'

// 앱 전체에서 하나만 쓴다. 캐시 전략(staleTime 등)은 Step 9에서 정한다.
export const queryClient = new QueryClient()
