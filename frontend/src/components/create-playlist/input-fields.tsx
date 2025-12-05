import { usePlaylist } from "@/context/playlist-context";
import { Button, buttonVariants } from "../ui/button"; // 🛠️ Importamos buttonVariants para los Dialogs
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FaExclamationCircle, FaGithub } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Para combinar clases si es necesario

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CheckIcon } from "@/components/ui/check";

export default function InputFields() {
  const [authHeaders, setAuthHeaders] = useState("");
  const [serverOnline, setServerOnline] = useState(false);

  const [isValidUrl, setIsValidUrl] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [starPrompt, setStarPrompt] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>("");
  const [cloneError, setCloneError] = useState(false);
  const [cloneErrorMessage, setCloneErrorMessage] =
    useState<React.ReactNode>("");
  const [missedTracksDialog, setMissedTracksDialog] = useState(false);
  const [missedTracks, setMissedTracks] = useState<{
    count: number;
    tracks: string[];
  }>({
    count: 0,
    tracks: [],
  });

  const { playlistUrl, setPlaylistUrl } = usePlaylist();

  const validateUrl = (url: string) => {
    const pattern = /^(?:https?:\/\/)?open\.spotify\.com\/playlist\/.+/;
    return pattern.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPlaylistUrl(url);
    setIsValidUrl(validateUrl(url) || url === "");
  };

  async function clonePlaylist() {
    const body = {
      playlist_link: playlistUrl,
      auth_headers: authHeaders,
    };

    try {
      setDialogOpen(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.missed_tracks.count > 0) {
          setMissedTracks(data.missed_tracks);
          setMissedTracksDialog(true);
        }
        setStarPrompt(true);
      } else if (res.status === 500) {
        setCloneError(true);
        setCloneErrorMessage(
          <>
            Server timeout while cloning playlist. Please try again or{" "}
            <a
              href="https://github.com/edvincodes/LinkList/issues/new/choose"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              report this issue
            </a>
          </>
        );
      } else {
        setCloneError(true);
        setCloneErrorMessage(data.message || "Failed to clone playlist");
      }
    } catch {
      setCloneError(true);
      setCloneErrorMessage("Network error while cloning playlist");
    } finally {
      setDialogOpen(false);
    }
  }

  async function testConnection() {
    setConnectionDialogOpen(true);
    setConnectionError(false);
    setServerOnline(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setServerOnline(true);
        console.log(data);
      } else if (res.status === 500) {
        setConnectionError(true);
        setErrorMessage(
          <>
            Server Error (500). The server likely hit a timeout. Please try
            again later or{" "}
            <a
              href="https://github.com/edvincodes/LinkList/issues/new/choose"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              report this issue on GitHub
            </a>
            .
          </>
        );
      }
    } catch {
      setConnectionError(true);
      setErrorMessage(
        <>
          Unable to connect to server. If this issue persists, please contact me
          or{" "}
          <a
            href="https://github.com/edvincodes/LinkList/issues/new/choose"
            className="text-cyan-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            open an issue on GitHub
          </a>
        </>
      );
    } finally {
      setConnectionDialogOpen(false);
    }
  }

  return (
    <>
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-10 lg:gap-16 px-4 mb-20">
        {/* Columna Izquierda: Headers */}
        <div className="flex flex-col gap-4 items-center w-full lg:w-1/2">
          <div className="space-y-1 w-full">
            <h1 className="text-xl font-bold text-foreground">
              Paste YouTube Music headers here
            </h1>
            <p className="text-sm text-muted-foreground">
              Required to authenticate your YouTube Music account.
            </p>
          </div>
          <Textarea
            placeholder="Paste your headers here"
            value={authHeaders}
            onChange={(e) => setAuthHeaders(e.target.value)}
            id="auth-headers"
            // 🛠️ LIMPIO: Usamos el estilo por defecto del componente + tamaño específico
            className="w-full h-[300px] resize-none"
          />
        </div>

        {/* Columna Derecha: Conexión y URL */}
        <div className="flex flex-col w-full lg:w-1/2 gap-6 lg:gap-10">
          {/* 1. Conexión */}
          <div className="flex flex-col w-full gap-4 items-start">
            <div className="space-y-2 w-full">
              <h1 className="text-xl font-bold text-foreground">
                1. Server Connection
              </h1>

              {serverOnline ? (
                // 🛠️ CORRECCIÓN: Cambiamos <p> por <div>
                <div className="text-lime-400 font-semibold text-sm flex items-center gap-2 animate-pulse">
                  <CheckIcon className="w-4 h-4" />
                  Connection Successful
                </div>
              ) : (
                // Aquí también es mejor usar <div> para mantener la consistencia, aunque <p> no daría error al no tener icono dentro
                <div className="text-cyan-400 text-sm">
                  Click 'Connect' to verify the LinkList server status.
                </div>
              )}
            </div>

            <AlertDialog
              open={connectionDialogOpen}
              onOpenChange={setConnectionDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  size="lg" // 🛠️ Usamos size LG para mayor impacto
                  onClick={testConnection}
                  // Nota: Usa variant="default" (Cyan) automáticamente
                >
                  Connect
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Requesting connection...</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please wait till the server comes online. This may take up
                    to a minute.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* 2. URL Spotify */}
          <div className="flex flex-col w-full gap-4 items-start">
            <div className="space-y-2 w-full">
              <h1 className="text-xl font-bold text-foreground">
                2. Paste Spotify Playlist URL
              </h1>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-cyan-400 w-4 h-4" />
                  <p className="text-sm text-muted-foreground">
                    Make sure the playlist is public
                  </p>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <FaExclamationCircle className="text-yellow-400 w-4 h-4 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Timeout issues are common. Consider
                    <a
                      href="https://github.com/edvincodes/LinkList"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline ml-1"
                    >
                      self-hosting
                    </a>{" "}
                    for better reliability.
                  </p>
                </div>
              </div>
            </div>

            <Input
              placeholder="Paste your playlist URL here"
              value={playlistUrl}
              onChange={handleUrlChange}
              id="playlist-name"
              // 🛠️ LIMPIO: Solo añadimos clase de error si es necesario
              className={
                !isValidUrl
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : ""
              }
            />
            {!isValidUrl && (
              <p className="text-red-500 text-sm">
                Please enter a valid Spotify playlist URL
              </p>
            )}

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={
                    !isValidUrl ||
                    !authHeaders ||
                    playlistUrl.trim() === "" ||
                    !serverOnline
                  }
                  className="w-full"
                  variant="lime" // 🚀 USAMOS LA NUEVA VARIANTE LIME
                  size="lg"
                  onClick={clonePlaylist}
                >
                  Clone Playlist
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Fetching playlist...</AlertDialogTitle>
                  <AlertDialogDescription>
                    This may take a few minutes
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* --- DIÁLOGOS DE ALERTA --- */}

      {/* Éxito / Star Prompt */}
      <AlertDialog open={starPrompt} onOpenChange={setStarPrompt}>
        <AlertDialogContent className="bg-card border border-lime-500/30 shadow-2xl shadow-lime-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lime-400 flex items-center gap-2 text-xl">
              <CheckIcon className="w-6 h-6" />
              Your Playlist has been cloned!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80 text-base">
              <div className="mt-4 space-y-2">
                <p>Please consider starring the project on GitHub.</p>
                <p>It's free and helps me a lot!</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <Button
                variant="outline"
                className="w-full border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400"
                asChild
              >
                <a
                  href="https://github.com/edvincodes/LinkList"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  ⭐ Star on GitHub
                  <FaGithub className="w-4 h-4" />
                </a>
              </Button>
              {/* Usamos buttonVariants para aplicar el estilo Lime al AlertDialogAction */}
              <AlertDialogAction
                className={cn(
                  buttonVariants({ variant: "lime" }),
                  "w-full text-black"
                )}
              >
                Clone Another Playlist
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error de Conexión */}
      <AlertDialog open={connectionError} onOpenChange={setConnectionError}>
        <AlertDialogContent className="bg-card border border-red-500/30 shadow-2xl shadow-red-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <FaExclamationCircle /> Connection Error
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setConnectionError(false)}
              className={buttonVariants({ variant: "destructive" })}
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error de Clonación */}
      <AlertDialog open={cloneError} onOpenChange={setCloneError}>
        <AlertDialogContent className="bg-card border border-red-500/30 shadow-2xl shadow-red-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <FaExclamationCircle /> Clone Error
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80">
              {cloneErrorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setCloneError(false)}
              className={buttonVariants({ variant: "destructive" })}
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pistas Omitidas */}
      <AlertDialog
        open={missedTracksDialog}
        onOpenChange={setMissedTracksDialog}
      >
        <AlertDialogContent className="bg-card border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-400 flex items-center gap-2">
              <FaExclamationCircle /> Some songs couldn't be found
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80">
              <div className="mt-2">
                <p className="mb-2">
                  {missedTracks.count} songs couldn't be found on YouTube Music:
                </p>
                <div className="max-h-[200px] overflow-y-auto bg-background/50 p-2 rounded-md border border-white/10">
                  <ul className="list-disc list-inside space-y-1">
                    {missedTracks.tracks.map((track, index) => (
                      <li key={index} className="text-sm font-mono">
                        {track}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setMissedTracksDialog(false)}
              className={buttonVariants({ variant: "secondary" })}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
