import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    // El nav tiene w-full para que el borde y el fondo cubran toda la pantalla
    <nav className="fixed top-0 z-50 w-full backdrop-blur-sm bg-gray-950/70 border-b border-cyan-500/30">
      {/* 🛠️ Contenedor centrado max-w-7xl */}
      <div className="flex w-full max-w-7xl mx-auto justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="text-lg font-medium transition-colors">
          <span
            className="text-transparent bg-clip-text font-extrabold text-2xl tracking-wider 
                       bg-gradient-to-r from-cyan-300 to-lime-400 
                       drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
          >
            LinkList
          </span>
        </Link>

        {/* ENLACES DERECHA */}
        <div className="flex items-center gap-8">
          {/* 🛠️ NUEVO: Enlace a Announcements */}
          <Link
            to="/announcements"
            className="text-white hover:text-cyan-400 text-lg font-medium transition-colors"
          >
            Announcements
          </Link>

          {/* Enlace a GitHub */}
          <a
            href="https://github.com/edvincodes/LinkList"
            className="text-white hover:text-cyan-400 flex items-center transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="w-6 h-6 sm:mr-2" />
            <span className="hidden sm:inline text-lg font-medium">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
