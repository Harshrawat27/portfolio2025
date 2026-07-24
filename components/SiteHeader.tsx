'use client';

import Link from 'next/link';
import { useTheme } from '@/lib/ThemeProvider';

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className='flex items-baseline justify-between pt-4 pb-20 rise'
      style={{ animationDelay: '0ms' }}
    >
      <Link href='/' className='text-[15px] font-semibold tracking-tight'>
        Harsh Rawat
      </Link>
      <nav className='flex items-baseline gap-6 text-[15px]'>
        <Link href='/blogs' className='ink-link'>
          Writing
        </Link>
        <Link href='/projects' className='ink-link'>
          Projects
        </Link>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className='text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors leading-none translate-y-[1px]'
        >
          ◐
        </button>
      </nav>
    </header>
  );
}
