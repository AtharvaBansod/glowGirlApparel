import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from 'geist/font/mono';
import "./globals.css";

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Define the metadata for the application
export const metadata: Metadata = {
  title: {
    default: "Glow Girl Apparel | Custom & Curated Fashion",
    template: "%s | Glow Girl Apparel",
  },
  description: "Express your unique style with custom printed t-shirts, hoodies, and more from Glow Girl Apparel. High-quality materials and vibrant prints.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans`}>
        {/*
          Provider Nesting Order:
          - AuthProvider: Manages user session, should be high up.
          - ThemeProvider: Manages dark/light mode.
          - ApiProvider: Handles communication with our backend.
          - CartProvider: Manages shopping cart state.
        */}
        <AuthProvider>
          <ThemeProvider>
            <ApiProvider>
              <CartProvider>
                {/* Toaster for global notifications */}
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                  }}
                />

                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  {/* Main content area */}
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
                
              </CartProvider>
            </ApiProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}