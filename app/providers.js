"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

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