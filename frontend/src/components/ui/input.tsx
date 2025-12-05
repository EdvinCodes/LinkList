import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Estilos base: Altura fija, bordes redondeados, transición suave
          "flex h-10 w-full rounded-md border px-3 py-2 text-base md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",

          // 🎨 ESTILO NEÓN LINKLIST POR DEFECTO:
          // 1. Fondo oscuro translúcido (bg-secondary/20)
          // 2. Borde sutil Cian (border-cyan-500/30)
          // 3. Tipografía Mono para aspecto técnico (font-mono)
          // 4. Placeholder sutil
          "bg-secondary/20 border-cyan-500/30 text-foreground placeholder:text-muted-foreground/50 font-mono",

          // ✨ EFECTO FOCUS:
          // Brillo Cian y anillo de enfoque
          "focus-visible:outline-none focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-500/20",

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
