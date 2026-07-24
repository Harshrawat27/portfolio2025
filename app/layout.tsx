import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/lib/ThemeProvider';
import ClickSound from '@/components/ClickSound';

// Serif for display and body text
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

// Mono for meta labels, dates, and code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
    <html
      lang='en'
      className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className='font-serif min-h-screen flex flex-col'>
        <ThemeProvider>
          <ClickSound />
          <main className='flex-grow w-full mx-auto max-w-[42rem] px-6 py-8'>
            {children}
            <Analytics />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
