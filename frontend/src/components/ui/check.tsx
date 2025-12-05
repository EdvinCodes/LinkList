"use client";

import { useEffect } from "react";
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

// 1. Define el tipo de propiedades que acepta el componente (todas las propiedades de un DIV).
// Usamos React.HTMLAttributes<HTMLDivElement> para incluir 'className', 'onClick', etc.
type CheckIconProps = React.HTMLAttributes<HTMLDivElement>;

const pathVariants: Variants = {
  initial: {
    opacity: 0,
    pathLength: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      opacity: { duration: 0.2 },
    },
  },
};

// 2. Modifica el componente para aceptar las props.
// Ahora acepta todas las props que le pasemos, incluyendo 'className'.
const CheckIcon = (props: CheckIconProps) => {
  const controls = useAnimation();

  useEffect(() => {
    setTimeout(() => {
      controls.start("animate");
    }, 250);
  }, [controls]);

  return (
    // 🛠️ ¡Aquí pasamos todas las props (incluyendo className) al DIV contenedor!
    <div
      {...props}
      className={`p-2 flex items-center justify-center ${
        props.className || ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          variants={pathVariants}
          initial="initial"
          animate={controls}
          d="M4 12 9 17L20 6"
        />
      </svg>
    </div>
  );
};

export { CheckIcon };
