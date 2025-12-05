import GetHeaders from "@/components/create-playlist/get-headers";
import InputFields from "@/components/create-playlist/input-fields";
// Navbar y Footer eliminados

export default function CreatePlaylist() {
  return (
    // Estructura simplificada
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start mt-20 md:mt-24">
      <div className="w-full mb-10">
        <GetHeaders />
      </div>

      <h2
        className="my-10 text-center text-3xl md:text-5xl font-extrabold mx-auto py-2 
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-cyan-300 to-lime-400 
                     drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
      >
        Create Playlist
      </h2>

      <div className="w-full">
        <InputFields />
      </div>

      {/* Footer eliminado */}
    </main>
  );
}
