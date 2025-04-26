import Navigation from "@/app/components/Navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Brian & Alexis Wedding",
  description: "Join us in celebrating the wedding of Brian and Alexis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased min-h-svh`}>
        <Navigation />
        {children}
      </body>
    </html >
  );
}
