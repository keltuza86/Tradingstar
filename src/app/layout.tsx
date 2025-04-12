import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradingSync Pro - Sistema de Seguimiento y Análisis de Trading",
  description: "Plataforma web para seguimiento y análisis de operaciones de trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-700 text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">TradingSync Pro</h1>
              <p className="text-sm">Sistema de Seguimiento y Análisis de Trading</p>
            </div>
          </header>
          <nav className="bg-blue-800 text-white p-2">
            <div className="container mx-auto flex space-x-4">
              <Link href="/" className="hover:underline">Inicio</Link>
              <Link href="/dashboard" className="hover:underline">Panel de Control</Link>
              <Link href="/operations" className="hover:underline">Operaciones</Link>
              <Link href="/trading-journal" className="hover:underline">Diario de Trading</Link>
              <Link href="/calendar" className="hover:underline">Calendario</Link>
              <Link href="/import" className="hover:underline">Importar Datos</Link>
            </div>
          </nav>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
            <p>TradingSync Pro © {new Date().getFullYear()} - Todos los derechos reservados</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
