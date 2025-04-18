import Navigation from "@/app/components/Navigation";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className="min-h-svh">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
