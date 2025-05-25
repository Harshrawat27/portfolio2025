'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/lib/ThemeProvider';

export default function SideNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Determine which path is active
  const isHome = pathname === '/';
  const isProjects = pathname.includes('/projects');
  const isExperience = pathname.includes('/experience');
  const isBlogs = pathname.includes('/blogs');
  const isContact = pathname === '/contact';

  return (
    <div className='side-nav'>
      {/* Home */}
      <Link
        href='/'
        className={`side-nav-item ${isHome ? 'active' : ''}`}
        title='Home'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      </Link>

      {/* Projects */}
      <Link
        href='/projects'
        className={`side-nav-item ${isProjects ? 'active' : ''}`}
        title='Projects'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          />
        </svg>
      </Link>

      {/* Experience */}
      <Link
        href='/experience'
        className={`side-nav-item ${isExperience ? 'active' : ''}`}
        title='Experience'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0h1a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h1m8 0h1a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h1'
          />
        </svg>
      </Link>

      {/* Blogs */}
      <Link
        href='/blogs'
        className={`side-nav-item ${isBlogs ? 'active' : ''}`}
        title='Blogs'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
          />
        </svg>
      </Link>

      {/* Contact */}
      <Link
        href='/contact'
        className={`side-nav-item ${isContact ? 'active' : ''}`}
        title='Contact'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          />
        </svg>
      </Link>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className='side-nav-item'
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          </svg>
        )}
      </button>
    </div>
  );
}
