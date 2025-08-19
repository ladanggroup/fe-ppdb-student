import React, { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router";
import routes from "./routes/routes";
import { Toaster } from "sonner";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";

const LoadingFallback = () => <div>Loading...</div>;

function LazyWrapper({ element }) {
  return <Suspense fallback={<LoadingFallback />}>{element}</Suspense>;
}

function wrapRoutesWithLazy(routes) {
  return routes.map((route) => ({
    ...route,
    element: route.element && (
      <LazyWrapper element={React.createElement(route.element)} />
    ),
    children: route.children ? wrapRoutesWithLazy(route.children) : [],
  }));
}

// function wrapRoutesWithLazy(routes) {
//   return routes.map((route) => ({
//     ...route,
//     element: route.element && <LazyWrapper element={<route.element />} />,
//     children: route.children ? wrapRoutesWithLazy(route.children) : [],
//   }));
// }

function AppRoutes() {
  const element = useRoutes(wrapRoutesWithLazy(routes));
  return <>{element}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
