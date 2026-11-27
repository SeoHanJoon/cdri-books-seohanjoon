import { Outlet } from 'react-router';

import { Header } from '@/components/Header';

export function RootLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-248 px-4">
        <Outlet />
      </main>
    </>
  );
}
