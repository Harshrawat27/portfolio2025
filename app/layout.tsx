import type { Metadata } from 'next';
import { JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/lib/ThemeProvider';

// Font for code and technical elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Font for UI and general text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Harsh Rawat',
  description:
    'Waiting for AGI | Experimenting without expectation | Self-taught | Never been to college',
  keywords: [
    'Full Stack Developer',
    'React',
    'Node.js',
    'TypeScript',
    'Web Development',
  ],
  authors: [{ name: 'Harsh Rawat' }],
  openGraph: {
    title: 'Harsh Rawat',
    description:
      'Waiting for AGI | Experimenting without expectation | Self-taught | Never been to college',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harsh Rawat',
    description:
      'Waiting for AGI | Experimenting without expectation | Self-taught | Never been to college',
  },
  // Proper favicon configuration
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className='font-sans min-h-screen flex flex-col relative'>
        <ThemeProvider>
          {/* Date indicator */}
          <div className='fixed top-4 right-4 text-xs font-mono text-[var(--text-secondary)] z-40'>
            {new Date()
              .toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
              .toUpperCase()}
          </div>

          {/* Main content */}
          <main className='flex-grow container mx-auto max-w-[800px] px-4 py-8'>
            {children}
            <Analytics />
          </main>

          {/* Grid decorations */}
          <div className='grid-marker top-[25%] left-[10%]'></div>
          <div className='grid-marker bottom-[15%] right-[10%]'></div>
          <div className='grid-marker top-[10%] right-[30%]'></div>
          <div className='grid-marker bottom-[30%] left-[20%] '></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
