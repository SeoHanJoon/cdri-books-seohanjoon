import { clsx } from 'clsx';
import { Link, NavLink } from 'react-router';

const TABS = [
  { to: '/', label: '도서 검색' },
  { to: '/wishlist', label: '내가 찜한 책' },
];

export function Header() {
  return (
    <header className="relative flex flex-col bg-white md:h-20 md:flex-row md:items-center">
      <Link
        to="/"
        className="flex h-14 items-center pl-4 text-title1 text-text-primary md:h-auto md:pl-6 xl:pl-40"
      >
        CERTICOS BOOKS
      </Link>
      <nav
        aria-label="주요 메뉴"
        className="flex justify-center md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2"
      >
        <ul className="flex">
          {TABS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className="flex h-12 items-center px-7 text-body1 text-text-primary md:h-20"
              >
                {({ isActive }) => (
                  <span
                    className={clsx(
                      'border-b pt-1.75 pb-1.5',
                      isActive ? 'border-primary' : 'border-transparent',
                    )}
                  >
                    {label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
