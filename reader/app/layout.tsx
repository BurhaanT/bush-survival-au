import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Victoria field guide · Book reader',
  description: 'A reading and layout preview of the working Victorian Bush Survival Field Guide.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
