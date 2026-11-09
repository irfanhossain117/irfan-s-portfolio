import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Irfan Hossain Nishat — Developer & Digital Creator',
  description:
    'The portfolio of Irfan Hossain Nishat. Explore selected projects across e-commerce, interactive tools, digital safety, and productivity.',
  applicationName: 'Irfan Hossain Nishat Portfolio',
  keywords: [
    'Irfan Hossain Nishat',
    'Irfan Nishat',
    'Web Developer',
    'Portfolio',
    'Fragré de Riva',
    'WorldHistora',
    'ScamShield BD'
  ],
  openGraph: {
    title: 'Irfan Hossain Nishat — Developer & Digital Creator',
    description: 'Ideas into useful digital experiences.',
    type: 'website'
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f5ef'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
