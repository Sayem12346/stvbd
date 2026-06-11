import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sayem TV',
  description: 'Live TV Channels - Sayem TV',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bgdark text-white min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}
