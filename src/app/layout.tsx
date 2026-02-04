import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PitchCraft AI — Crie Pitch Decks Profissionais em Minutos",
  description: "Transforme sua ideia de startup em um pitch deck profissional usando inteligência artificial. Gere apresentações impactantes para investidores em menos de 2 minutos.",
  keywords: ["pitch deck", "startup", "investidores", "apresentação", "IA", "AI", "empreendedorismo"],
  authors: [{ name: "PitchCraft AI" }],
  openGraph: {
    title: "PitchCraft AI — Crie Pitch Decks Profissionais em Minutos",
    description: "Transforme sua ideia de startup em um pitch deck profissional usando inteligência artificial.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
