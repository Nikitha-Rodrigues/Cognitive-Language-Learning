"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="natural"
      enableSystem={false}
      themes={["natural", "modern", "neutral"]}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}