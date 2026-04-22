import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const metadata: Metadata = {
  title: "Motoke - Kenya's Trusted Automotive Marketplace",
  description: "Buy, sell, and auction vehicles in Kenya with secure payments and verified listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NotificationProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
