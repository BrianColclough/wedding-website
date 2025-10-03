import Navigation from "@/app/components/Navigation";
import "leaflet/dist/leaflet.css";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-white antialiased min-h-svh`}
      >
        <Navigation />
        <div className="min-h-svh w-full m-0 p-0 bg-black">{children}</div>
      </body>
    </html>
  );
}
