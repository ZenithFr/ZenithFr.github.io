import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['700', '800'],
});

export const metadata: Metadata = {
  title: 'Zenith — Creative Developer & Designer',
  description:
    "Zenith's personal website — creative thinker, builder, and digital craftsman. Explore projects, connect, and say hi.",
  keywords: ['Zenith', 'Allen', 'developer', 'designer', 'creative', 'portfolio'],
  authors: [{ name: 'Zenith' }],
  openGraph: {
    title: 'Zenith — Creative Developer & Designer',
    description: "Zenith's personal website — creative thinker, builder, and digital craftsman.",
    url: 'https://zenesis.me',
    siteName: 'Zenith',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenith — Creative Developer & Designer',
    description: "Zenith's personal website — creative thinker, builder, and digital craftsman.",
  },
  metadataBase: new URL('https://zenesis.me'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${syne.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
