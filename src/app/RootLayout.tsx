import { Outlet } from 'react-router'

// 모든 페이지가 공유하는 틀. Header와 레이아웃은 Step 2에서 채운다.
export function RootLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
