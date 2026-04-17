import type { ReactNode } from "react";

import "@/styles/globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-text antialiased">{children}</body>
    </html>
  );
}
