import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="hidden md:flex items-center justify-center p-2 rounded-full bg-white transition"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-900" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </button>
  );
}
