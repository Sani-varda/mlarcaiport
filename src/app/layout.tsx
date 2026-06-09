import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sani Varada — AI/ML Engineer & Quant Analyst",
  description: "Portfolio of Sani Varada, Founder of ML Arc. Specialized in custom LLM systems, hybrid RAG pipelines, quantitative trading strategies, and MLOps.",
  keywords: ["Sani Varada", "AI/ML Engineer", "Quant Analyst", "ML Arc", "Machine Learning Portfolio", "RAG Pipeline", "Quantitative Trading", "FastAPI", "Next.js"],
  authors: [{ name: "Sani Varada", url: "https://www.mlarcai.com" }],
  creator: "Sani Varada",
  metadataBase: new URL("https://www.mlarcai.com"),
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sani Varada — AI/ML Engineer & Quant Analyst",
    description: "Portfolio of Sani Varada, Founder of ML Arc. Specialized in custom LLM systems, hybrid RAG pipelines, quantitative trading strategies, and MLOps.",
    url: "https://www.mlarcai.com",
    siteName: "Sani Varada Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sani Varada — AI/ML Engineer & Quant Analyst",
    description: "Portfolio of Sani Varada, Founder of ML Arc. Specialized in custom LLM systems, hybrid RAG pipelines, quantitative trading strategies, and MLOps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#ffffff] text-[#0f172a]">
        <div className="cinematic-vignette" />
        <div className="noise-overlay" />
        
        {children}
      </body>
    </html>
  );
}
