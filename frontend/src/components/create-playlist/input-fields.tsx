import { usePlaylist } from "@/context/playlist-context";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FaExclamationCircle, FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  // Recuperar estado inicial si existe en sessionStorage
  const savedHeaders = sessionStorage.getItem("temp_auth_headers") || "";

  const [authHeaders, setAuthHeaders] = useState(savedHeaders);
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

  // Efecto de Inicialización: Recuperar datos y Auto-Conectar
  useEffect(() => {
    // Recuperar URL guardada si existe y el contexto está vacío
    const savedUrl = sessionStorage.getItem("temp_playlist_url");
    if (savedUrl && !playlistUrl) {
      setPlaylistUrl(savedUrl);
    }

    // Intentar conectar al servidor automáticamente al cargar
    testConnection(true); // true = modo silencioso

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateUrl = (url: string) => {
    const pattern = /^(?:https?:\/\/)?open\.spotify\.com\/playlist\/.+/;
    return pattern.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPlaylistUrl(url);
    setIsValidUrl(validateUrl(url) || url === "");
    // Guardar en sesión mientras escribes para no perderlo
    sessionStorage.setItem("temp_playlist_url", url);
  };

  const handleHeadersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setAuthHeaders(val);
    sessionStorage.setItem("temp_auth_headers", val);
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
        sessionStorage.removeItem("temp_playlist_url");
      } else if (res.status === 500) {
        setCloneError(true);
        setCloneErrorMessage(
          <>
            Server Error. Please try again or{" "}
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

  // Modificado para aceptar modo silencioso (silent = true)
  async function testConnection(silent = false) {
    if (!silent) {
      setConnectionDialogOpen(true);
      setConnectionError(false);
    }
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
      } else if (res.status === 500 && !silent) {
        setConnectionError(true);
        setErrorMessage(<>Server Error (500).</>);
      }
    } catch {
      if (!silent) {
        setConnectionError(true);
        setErrorMessage(<>Unable to connect to server.</>);
      }
    } finally {
      if (!silent) setConnectionDialogOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start justify-center w-full max-w-6xl gap-10 px-4 mb-20 lg:flex-row lg:gap-16">
        {/* Columna Izquierda: Headers YTM */}
        <div className="flex flex-col items-center w-full gap-4 lg:w-1/2">
          <div className="w-full space-y-1">
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
            onChange={handleHeadersChange}
            id="auth-headers"
            className="w-full h-[300px] resize-none"
          />
        </div>

        {/* Columna Derecha: Conexión y Spotify */}
        <div className="flex flex-col w-full gap-6 lg:w-1/2 lg:gap-10">
          {/* 1. Conexión */}
          <div className="flex flex-col items-start w-full gap-4">
            <div className="w-full space-y-2">
              <h1 className="text-xl font-bold text-foreground">
                1. Server Connection
              </h1>
              {serverOnline ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-lime-400 animate-pulse">
                  <CheckIcon className="w-4 h-4" />
                  Connection Successful
                </div>
              ) : (
                <div className="text-sm text-cyan-400">
                  Connecting to server... (or click Connect manually)
                </div>
              )}
            </div>

            {!serverOnline && (
              <AlertDialog
                open={connectionDialogOpen}
                onOpenChange={setConnectionDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => testConnection(false)}
                  >
                    Connect Manually
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border bg-card border-cyan-500/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Requesting connection...
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Please wait till the server comes online.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* 2. URL Spotify (Sin Login) */}
          <div className="flex flex-col items-start w-full gap-4">
            <div className="w-full space-y-2">
              <h1 className="text-xl font-bold text-foreground">
                2. Paste Spotify Playlist URL
              </h1>

              <div className="flex flex-col gap-2 mt-1">
                {/* Advertencia 1: Playlist pública */}
                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Make sure the playlist is public
                  </p>
                </div>

                {/* Advertencia 2: Playlists no soportadas (NUEVA) */}
                <div className="flex items-start gap-2">
                  <FaExclamationCircle className="text-orange-400 w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Not all playlists work. Spotify-owned or algorithmic
                    playlists (like "Mega Hit Mix") may fail.
                  </p>
                </div>

                {/* Advertencia 3: Timeout */}
                <div className="flex items-start gap-2">
                  <FaExclamationCircle className="text-yellow-400 w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Timeout issues are common. Consider
                    <a
                      href="https://github.com/edvincodes/LinkList"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-cyan-400 hover:underline"
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
              className={
                !isValidUrl
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : ""
              }
            />
            {!isValidUrl && (
              <p className="text-sm text-red-500">
                Please enter a valid Spotify playlist URL
              </p>
            )}

            {/* Botón Clone */}
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
                  variant="lime"
                  size="lg"
                  onClick={clonePlaylist}
                >
                  Clone Playlist
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border bg-card border-cyan-500/20">
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
      <AlertDialog open={starPrompt} onOpenChange={setStarPrompt}>
        <AlertDialogContent className="border shadow-2xl bg-card border-lime-500/30 shadow-lime-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl text-lime-400">
              <CheckIcon className="w-6 h-6" />
              Your Playlist has been cloned!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground/80">
              <div className="mt-4 space-y-2">
                <p>Please consider starring the project on GitHub.</p>
                <p>It's free and helps me a lot!</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <div className="flex flex-col items-center w-full gap-3 sm:flex-row">
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

      <AlertDialog open={connectionError} onOpenChange={setConnectionError}>
        <AlertDialogContent className="border shadow-2xl bg-card border-red-500/30 shadow-red-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
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

      <AlertDialog open={cloneError} onOpenChange={setCloneError}>
        <AlertDialogContent className="border shadow-2xl bg-card border-red-500/30 shadow-red-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
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

      <AlertDialog
        open={missedTracksDialog}
        onOpenChange={setMissedTracksDialog}
      >
        <AlertDialogContent className="border shadow-2xl bg-card border-yellow-500/30 shadow-yellow-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-yellow-400">
              <FaExclamationCircle /> Some songs couldn't be found
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80">
              <div className="mt-2">
                <p className="mb-2">
                  {missedTracks.count} songs couldn't be found on YouTube Music:
                </p>
                <div className="max-h-[200px] overflow-y-auto bg-background/50 p-2 rounded-md border border-white/10">
                  <ul className="space-y-1 list-disc list-inside">
                    {missedTracks.tracks.map((track, index) => (
                      <li key={index} className="font-mono text-sm">
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
