import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    // 🛠️ Borde superior Neón y fondo oscuro
    <footer className="border-t border-cyan-500/30 w-full mt-28 py-10 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        {/* Usamos flex y gap-1 para alinear texto, corazón y enlace perfectamente */}
        <p className="mb-2 flex items-center justify-center gap-1">
          Developed with
          {/* 🛠️ CORRECCIÓN: Usar className. Añadido color rojo y animación de pulso */}
          <span className="text-red-500 animate-pulse text-lg">❤</span>
          by
          <a
            href="https://github.com/edvincodes"
            target="_blank"
            rel="noopener noreferrer"
            // 🛠️ Color de acento Cian para tu handle
            className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            Edvin
            <FaGithub className="w-4 h-4" />
          </a>
        </p>
      </div>
    </footer>
  );
}
