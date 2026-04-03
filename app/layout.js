import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Cognitive Language Learning",
  description:
    "AI-powered language learning that adapts to your cognitive level. No more overwhelming translations - learn naturally.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans bg-bg-primary text-textPrimary antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}