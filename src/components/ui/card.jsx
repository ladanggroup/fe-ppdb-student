import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border shadow",
      "bg-ppdb-soft text-black border-ppdb-orange-dark",
      "dark:bg-ppdb-gray-dark dark:text-white dark:border-ppdb-orange",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

// import * as React from "react";
// import { cn } from "@/lib/utils";

// const Card = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "rounded-xl border shadow-lg",
//       "bg-ppdb-orange-soft text-ppdb-gray-dark border-ppdb-orange-dark",
//       "dark:bg-ppdb-gray-dark dark:text-ppdb-orange-soft dark:border-ppdb-orange",
//       "transition-all hover:shadow-xl",
//       className
//     )}
//     {...props}
//   />
// ));
// Card.displayName = "Card";

// const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "flex flex-col space-y-1.5 p-6 mb-4",
//       "border-b border-ppdb-orange-dark/20",
//       "dark:border-ppdb-orange/20",
//       className
//     )}
//     {...props}
//   />
// ));
// CardHeader.displayName = "CardHeader";

// const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
//   <h3
//     ref={ref}
//     className={cn(
//       "text-2xl font-bold tracking-tight",
//       "text-ppdb-orange-dark",
//       "dark:text-ppdb-orange",
//       className
//     )}
//     {...props}
//   />
// ));
// CardTitle.displayName = "CardTitle";

// const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
//   <p
//     ref={ref}
//     className={cn(
//       "text-sm",
//       "text-ppdb-gray-dark/80",
//       "dark:text-ppdb-orange-soft/80",
//       className
//     )}
//     {...props}
//   />
// ));
// CardDescription.displayName = "CardDescription";

// const CardContent = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "p-6 pt-0",
//       "text-ppdb-gray-dark",
//       "dark:text-ppdb-orange-soft",
//       className
//     )}
//     {...props}
//   />
// ));
// CardContent.displayName = "CardContent";

// const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "flex items-center justify-end p-6 pt-0",
//       "border-t border-ppdb-orange-dark/20",
//       "dark:border-ppdb-orange/20",
//       className
//     )}
//     {...props}
//   />
// ));
// CardFooter.displayName = "CardFooter";

// export {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// };