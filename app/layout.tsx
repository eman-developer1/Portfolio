import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://emankhan.dev'),
  title: 'Eman Khan | Web Developer',
  description:
    'Eman Khan is a web developer building modern, responsive and user-friendly websites and web applications using React, TypeScript, Next.js and modern web technologies.',
  keywords: [
    'Eman Khan',
    'Web Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'Portfolio'
  ],
  authors: [{ name: 'Eman Khan' }],
  creator: 'Eman Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://emankhan.dev',
    title: 'Eman Khan | Web Developer',
    description:
      'I Build Modern Digital Experiences. Creating responsive, interactive and user-friendly websites and web applications.',
    siteName: 'Eman Khan Portfolio',
    images: [
      {
        url: '/images/projects/portfolio-showcase.svg',
        width: 1200,
        height: 630,
        alt: 'Eman Khan - Web Developer Portfolio'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eman Khan | Web Developer',
    description:
      'Web developer building modern, responsive and user-friendly web applications using React, TypeScript, and Next.js.',
    images: ['/images/projects/portfolio-showcase.svg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
