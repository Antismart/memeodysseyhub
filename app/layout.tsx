import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "./components/WalletProvider";
import { ZoraCoinsProvider } from "./components/ZoraCoinsService";
import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meme Odyssey Hub",
  description: "Create, evolve, and trade meme content coins on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <ZoraCoinsProvider>
            {children}
          </ZoraCoinsProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
