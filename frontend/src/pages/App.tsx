import Hero from "@/components/landing/hero.tsx";
import HowToUse from "@/components/landing/how-to-use.tsx";
// Navbar y Footer eliminados de los imports

export default function App() {
  return (
    // Ya no necesitamos el div contenedor global ni bg-background
    // El Layout ya nos da el contexto flex, así que usamos el main directamente
    <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div className="mb-10 w-full">
        <Hero />
      </div>

      <h2
        className="mt-10 text-center mb-10 text-3xl md:text-5xl font-extrabold mx-auto py-2 
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-cyan-300 to-lime-400 
                     drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
      >
        How to use
      </h2>

      <div className="w-full">
        <HowToUse />
      </div>

      {/* Footer eliminado */}
    </main>
  );
}
