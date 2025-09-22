// src/components/theme-provider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) => {
  const [theme, _setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // helper to actually apply class to <html>
  const applyTheme = (themeValue) => {
    const root = window?.document?.documentElement;
    if (!root) return;

    // remove both so state always deterministic
    root.classList.remove("light", "dark");

    if (themeValue === "system") {
      // use prefers-color-scheme to decide
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      root.classList.add(prefersDark ? "dark" : "light");
      return;
    }

    // add chosen theme class
    root.classList.add(themeValue);
  };

  useEffect(() => {
    // apply on mount (important)
    applyTheme(theme);

    // listen to system theme change if theme === 'system'
    let mql;
    const handlePrefersChange = (e) => {
      if (theme === "system") applyTheme(e.matches ? "dark" : "light");
      if (theme === "system") applyTheme("system");
    };
    try {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      if (mql?.addEventListener) mql.addEventListener("change", handlePrefersChange);
      else if (mql?.addListener) mql.addListener(handlePrefersChange);
    } catch (err) {
      // ignore on older browsers
      console.error(err);
    }

    return () => {
      try {
        if (mql?.removeEventListener) mql.removeEventListener("change", handlePrefersChange);
        else if (mql?.removeListener) mql.removeListener(handlePrefersChange);
      } catch {
        // ignore
        localStorage.removeItem(storageKey);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // keep state setter that persists to localStorage and applies immediately
  const setTheme = (newTheme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // ignore
      console.error("Failed to set theme");
    }
    _setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};