import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Japanese Hotel Booking - For Mongolian Users',
  description: 'Find and book the best hotels in Japan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
