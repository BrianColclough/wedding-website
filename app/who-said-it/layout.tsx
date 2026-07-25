import type { Metadata } from "next";
import { DM_Mono, Newsreader, Rubik_Mono_One } from "next/font/google";
import "./who-said-it.css";

// Scoped to this route rather than the root layout so the rest of the wedding
// site doesn't download three fonts it never uses.
const display = Rubik_Mono_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wsi-display",
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-wsi-body",
  display: "swap",
});

const util = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-wsi-util",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Who Said It?",
  description: "A family quote guessing game.",
  robots: { index: false, follow: false },
};

export default function WhoSaidItLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${util.variable}`}>{children}</div>
  );
}
