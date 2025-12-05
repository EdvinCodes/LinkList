import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { usePlaylist } from "@/context/playlist-context";
import { cn } from "@/lib/utils";

export default function Hero() {
  const { playlistUrl, setPlaylistUrl } = usePlaylist();

  // 1. Lógica de validación
  const validateUrl = (url: string) => {
    // Regex simple para playlists de Spotify
    const pattern = /^(?:https?:\/\/)?open\.spotify\.com\/playlist\/.+/;
    return pattern.test(url);
  };

  const isValid = validateUrl(playlistUrl);
  const isEmpty = playlistUrl.trim() === "";

  // Mostramos error solo si ha escrito algo y está mal
  const isError = !isEmpty && !isValid;

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="text-center w-full max-w-4xl mx-auto">
        {/* Botón Star */}
        <div className="flex justify-center items-center mb-8">
          <a
            href="https://github.com/edvincodes/LinkList"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 text-sm md:text-base h-auto"
            >
              Star LinkList on Github ⭐
            </Button>
          </a>
        </div>

        {/* Título Principal */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-center tracking-tight
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-400 
                     drop-shadow-[0_0_25px_rgba(34,211,238,0.2)]
                     pb-2"
        >
          Transfer your Spotify Playlist to YouTube Music
        </h1>

        <p className="text-center text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          LinkList is a free service that allows you to transfer your Spotify
          playlists to YouTube Music in a few simple steps.
        </p>

        {/* Formulario */}
        <form
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4 mt-12 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <span className="text-lg font-medium text-cyan-400 whitespace-nowrap">
            Paste your Spotify Link here
          </span>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl relative">
            {/* Input con feedback visual de error */}
            <Input
              placeholder="https://open.spotify.com/playlist/..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className={cn(
                "w-full h-12 text-lg transition-all duration-300",
                // Si hay error, borde rojo y anillo rojo. Si no, usa el estilo por defecto del componente Input.
                isError &&
                  "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
              )}
            />

            {/* Enlace condicional: Bloqueado si no es válido */}
            <Link
              to="/create-playlist"
              className={cn(!isValid ? "pointer-events-none" : "")}
              tabIndex={!isValid ? -1 : 0}
            >
              <Button
                variant="lime"
                className="w-full sm:w-auto h-12 px-8 text-lg"
                disabled={!isValid} // Deshabilitado visualmente
              >
                Get Started
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
