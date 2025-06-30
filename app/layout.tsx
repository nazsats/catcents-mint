import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catcents NFT Mint - Coming Soon',
  description: 'Get ready for catcents exclusive NFT mint!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}