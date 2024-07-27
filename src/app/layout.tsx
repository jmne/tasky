export const metadata = {
  title: 'Tasky',
  description: 'Your personal task manager..',
};

import { Inter } from 'next/font/google';

import Header from '@/components/layout/Header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
