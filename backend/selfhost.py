import os
import logging
import ytmusicapi
from ytmusicapi import YTMusic
from spotify import get_all_tracks, get_playlist_name
# Reutilizamos la lógica robusta de búsqueda que ya arreglamos
from ytm import get_video_ids 

# Configurar logs para ver el progreso en la terminal
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==========================================
# CONFIGURACIÓN MANUAL (Opcional)
# Puedes pegar tus datos aquí o dejarlo vacío
# y el script te preguntará al ejecutarlo.
# ==========================================

SPOTIFY_LINK = ""  # Ej: "https://open.spotify.com/playlist/..."

# Pega tus headers entre las tres comillas si quieres guardarlos fijos
HEADERS = """
"""

# ==========================================

def setup_auth():
    """Configura la autenticación de YT Music localmente"""
    auth_file = "browser.json"
    
    # Si ya existe el archivo, intentamos usarlo
    if os.path.exists(auth_file):
        try:
            YTMusic(auth_file)
            logger.info("Found existing browser.json, using saved credentials.")
            return auth_file
        except Exception:
            logger.warning("Existing browser.json is invalid. Re-authenticating...")

    # Si no hay archivo o es inválido, usamos los HEADERS
    raw_headers = HEADERS.strip()
    
    if not raw_headers:
        print("\n⚠️  No headers found in the script.")
        print("Please paste your Request Headers here (press Enter twice to finish):")
        lines = []
        while True:
            line = input()
            if line:
                lines.append(line)
            else:
                break
        raw_headers = '\n'.join(lines)

    if not raw_headers:
        raise Exception("No headers provided. Cannot authenticate.")

    logger.info("Setting up authentication...")
    ytmusicapi.setup(filepath=auth_file, headers_raw=raw_headers)
    return auth_file

def main():
    print("\n🔗 LinkList Self-Host Tool 🔗\n")
    
    try:
        # 1. Autenticación
        auth_file = setup_auth()
        ytmusic = YTMusic(auth_file)
        
        # 2. Obtener Link de Spotify
        link = SPOTIFY_LINK
        if not link:
            link = input("👉 Paste Spotify Playlist URL: ").strip()
            
        if not link:
            print("❌ No link provided. Exiting.")
            return

        # 3. Obtener Datos de Spotify
        logger.info("Fetching tracks from Spotify...")
        tracks = get_all_tracks(link, "IN")
        playlist_name = get_playlist_name(link)
        logger.info(f"Found {len(tracks)} tracks in playlist: {playlist_name}")

        # 4. Buscar en YouTube Music (Usando la lógica robusta de ytm.py)
        logger.info("Searching songs on YouTube Music...")
        video_ids, missed = get_video_ids(ytmusic, tracks)

        # 5. Reporte de canciones no encontradas
        if missed['count'] > 0:
            logger.warning(f"⚠️  {missed['count']} tracks could not be found.")
            with open('missed_tracks.txt', 'w', encoding='utf-8') as f:
                for track in missed['tracks']:
                    f.write(f"{track}\n")
            logger.info("List of missed tracks saved to 'missed_tracks.txt'")

        if not video_ids:
            logger.error("No tracks found to transfer. Exiting.")
            return

        # 6. Crear Playlist
        # Preguntar nombre o usar el de Spotify
        target_name = input(f"👉 Enter new playlist name (default: {playlist_name}): ").strip()
        if not target_name:
            target_name = playlist_name

        logger.info(f"Creating playlist '{target_name}' on your account...")
        playlist_id = ytmusic.create_playlist(target_name, "Created with LinkList CLI", "PUBLIC", video_ids)
        
        print(f"\n✅ SUCCESS! Playlist created.")
        print(f"🔗 URL: https://music.youtube.com/playlist?list={playlist_id}\n")

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()