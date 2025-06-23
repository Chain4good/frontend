import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        blue: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        gold: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        premium:
          "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300",
        achievement:
          "border-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300",
        special:
          "border-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300",
        diamond:
          "border-transparent bg-gradient-to-r from-slate-400 via-gray-300 to-zinc-400 text-gray-800 hover:from-slate-500 hover:via-gray-400 hover:to-zinc-500 shadow-lg hover:shadow-xl transition-all duration-300",
        royal:
          "border-transparent bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-sm",
        xl: "px-6 py-3 text-base",
        // Special size for UserBadge
        badge: "px-4 py-2.5 text-sm font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({ className, variant, size, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
