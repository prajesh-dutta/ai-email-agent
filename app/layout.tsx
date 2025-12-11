import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/context';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Email Productivity Agent | Powered by Gemini 2.5 Flash',
  description: 'AI-powered email management using Google Gemini 2.5 Flash. Categorize, extract actions, and draft replies automatically.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased h-screen overflow-hidden`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
