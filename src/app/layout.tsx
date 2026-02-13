import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from '@/components/providers/SessionProvider'
import Navbar from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: "CyberPunk Data Analytics - Обучение аналитике данных",
  description: "Современная платформа для изучения аналитики данных в стиле киберпанк",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-cyber-dark text-white">
        <AuthProvider>
          <div className="min-h-screen bg-cyber-dark">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
