// import { Moon, Sun } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown';
// import { useTheme } from '@/components/theme-provider';

// export function ModeToggle() {
//     const { setTheme } = useTheme();

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10">
//                 {/* <Button variant="outline" size="icon"> */}
//                     <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//                     <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//                     <span className="sr-only">Toggle theme</span>
//                 {/* </Button> */}
//                     </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => setTheme('light')}>
//                     Light
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme('dark')}>
//                     Dark
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme('system')}>
//                     System
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }

import { Moon, Sun } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const items = [
    { label: "Light", onSelect: () => setTheme("light") },
    { label: "Dark", onSelect: () => setTheme("dark") },
    { label: "System", onSelect: () => setTheme("system") },
  ];

  return (
    <Dropdown
      trigger={
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      }
      items={items}
      align="end"
    />
  );
}
