'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/lib/ThemeProvider';
import { useState } from 'react';

export default function SideNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Determine which path is active
  const isHome = pathname === '/';
  const isBlogs = pathname.includes('/blogs');

  const navItems = [
    {
      href: '/',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5'
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
      ),
      title: 'Home',
      isActive: isHome,
      type: 'link',
    },
    {
      href: '/blogs',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5'
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
      ),
      title: 'Blog',
      isActive: isBlogs,
      type: 'link',
    },
    {
      href: 'https://github.com/Harshrawat27',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5'
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
        </svg>
      ),
      title: 'GitHub',
      isActive: false,
      type: 'external',
    },
    {
      href: 'https://x.com/Harshrwt27',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5'
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
      ),
      title: 'X (Twitter)',
      isActive: false,
      type: 'external',
    },
    {
      href: 'mailto:harshrawat.dev@gmail.com',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5'
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
      ),
      title: 'Email',
      isActive: false,
      type: 'external',
    },
  ];

  const getItemScale = (index: number) => {
    if (hoveredIndex === null) return 1;

    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.4; // Hovered item
    if (distance === 1) return 1.2; // Adjacent items
    if (distance === 2) return 1.1; // Second adjacent
    return 1; // Far items
  };

  const getItemSpacing = (index: number) => {
    if (hoveredIndex === null) return 'my-1';

    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 'my-3'; // Hovered item gets more space
    if (distance === 1) return 'my-2'; // Adjacent items get some space
    return 'my-1'; // Normal spacing
  };

  return (
    <div className='fixed left-6 top-1/2 -translate-y-1/2 z-50'>
      <div
        className='flex flex-col bg-black/20 dark:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-2xl'
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Navigation Items */}
        {navItems.map((item, index) => (
          <div
            key={item.href}
            className={`transition-all duration-300 ease-out ${getItemSpacing(
              index
            )}`}
            style={{
              transform: `scale(${getItemScale(index)})`,
            }}
          >
            {item.type === 'external' ? (
              <a
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-xl 
                  transition-all duration-300 ease-out group
                  ${
                    item.isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
                title={item.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background glow effect */}
                <div
                  className={`
                  absolute inset-0 rounded-xl transition-all duration-300
                  ${
                    item.isActive
                      ? 'bg-gradient-to-br from-blue-400/20 to-purple-500/20 shadow-lg'
                      : 'group-hover:bg-gradient-to-br group-hover:from-blue-400/10 group-hover:to-purple-500/10'
                  }
                `}
                />

                {/* Icon */}
                <div className='relative z-10 transition-transform duration-300 group-hover:scale-110'>
                  {item.icon}
                </div>
              </a>
            ) : (
              <Link
                href={item.href}
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-xl 
                  transition-all duration-300 ease-out group
                  ${
                    item.isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
                title={item.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background glow effect */}
                <div
                  className={`
                  absolute inset-0 rounded-xl transition-all duration-300
                  ${
                    item.isActive
                      ? 'bg-gradient-to-br from-blue-400/20 to-purple-500/20 shadow-lg'
                      : 'group-hover:bg-gradient-to-br group-hover:from-blue-400/10 group-hover:to-purple-500/10'
                  }
                `}
                />

                {/* Icon */}
                <div className='relative z-10 transition-transform duration-300 group-hover:scale-110'>
                  {item.icon}
                </div>

                {/* Active indicator */}
                {item.isActive && (
                  <div className='absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-lg' />
                )}
              </Link>
            )}
          </div>
        ))}

        {/* Separator */}
        <div className='w-8 h-px bg-white/20 mx-auto my-2' />

        {/* Theme Toggle */}
        <div
          className={`transition-all duration-300 ease-out ${getItemSpacing(
            navItems.length
          )}`}
          style={{
            transform: `scale(${getItemScale(navItems.length)})`,
          }}
        >
          <button
            onClick={toggleTheme}
            className='relative flex items-center justify-center w-12 h-12 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ease-out group'
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onMouseEnter={() => setHoveredIndex(navItems.length)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Background glow effect */}
            <div className='absolute inset-0 rounded-xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-yellow-400/10 group-hover:to-orange-500/10' />

            {/* Icon with smooth transition */}
            <div className='relative z-10 transition-all duration-300 group-hover:scale-110 w-5 h-5 flex items-center justify-center'>
              {/* Sun icon */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                  theme === 'dark'
                    ? 'rotate-0 opacity-100 scale-100'
                    : 'rotate-180 opacity-0 scale-75'
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5'
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
              </div>
              {/* Moon icon */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                  theme === 'light'
                    ? 'rotate-0 opacity-100 scale-100'
                    : 'rotate-180 opacity-0 scale-75'
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5'
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
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
