import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base md:text-sm disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",

        // 🎨 ESTILO NEÓN LINKLIST:
        "bg-secondary/20 border-cyan-500/30 text-foreground placeholder:text-muted-foreground/50 font-mono",

        // ✨ EFECTO FOCUS:
        "focus-visible:outline-none focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-500/20",

        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
