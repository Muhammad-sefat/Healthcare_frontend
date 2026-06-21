import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/providers/authProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarePulse",
  description:
    "A premium, unified healthcare platform for patients, doctors, and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
