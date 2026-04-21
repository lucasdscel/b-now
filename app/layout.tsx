import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "My App",
    template: "%s | My App",
  },
  description: "Built with Next.js 14, TypeScript, Tailwind CSS and shadcn/ui",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "My App" }],
  creator: "My App",
  openGraph: {
    type: "website",
    locale: "es_CL",
    title: "My App",
    description: "Built with Next.js 14, TypeScript, Tailwind CSS and shadcn/ui",
    siteName: "My App",
  },
  twitter: {
    card: "summary_large_image",
    title: "My App",
    description: "Built with Next.js 14, TypeScript, Tailwind CSS and shadcn/ui",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
