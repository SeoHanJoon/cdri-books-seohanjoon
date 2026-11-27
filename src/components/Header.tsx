import { clsx } from 'clsx';
import { Link, NavLink } from 'react-router';

const TABS = [
  { to: '/', label: '도서 검색' },
  { to: '/wishlist', label: '내가 찜한 책' },
];

export function Header() {
  return (
    <header className="bg-white px-4 md:px-6">
      <div className="relative mx-auto flex max-w-400 flex-col md:h-20 md:flex-row md:items-center">
        <Link
          to="/"
          className="flex h-14 w-fit items-center text-title1 text-text-primary md:h-auto"
        >
          CERTICOS BOOKS
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="flex justify-center md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2"
        >
          <ul className="flex md:items-center md:gap-14">
            {TABS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className="flex h-12 items-center px-7 text-body1 text-text-primary md:h-auto md:px-0"
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
      </div>
    </header>
  );
}
