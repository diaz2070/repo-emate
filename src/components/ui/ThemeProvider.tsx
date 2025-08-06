'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({
  children,
  defaultTheme,
  storageKey,
  enableSystem,
  enableColorScheme,
  forcedTheme,
  disableTransitionOnChange,
  attribute,
  value,
  themes,
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem={enableSystem}
      enableColorScheme={enableColorScheme}
      forcedTheme={forcedTheme}
      disableTransitionOnChange={disableTransitionOnChange}
      attribute={attribute}
      value={value}
      themes={themes}
    >
      {children}
    </NextThemesProvider>
  );
}