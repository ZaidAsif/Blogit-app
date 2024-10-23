import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthContextProvider from "@/context/authContext";
import Navbar1 from "@/components/navbar1";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar1 />
      <Toaster position="top-right" />
        {children}
        <Footer />
      </body>
    </html>
    </AuthContextProvider>
  );
}
