import os
import tempfile
import logging
import ytmusicapi
from ytmusicapi import YTMusic
from spotify import get_all_tracks, get_playlist_name

logger = logging.getLogger(__name__)

def get_video_ids(ytmusic, tracks):
    video_ids = []
    missed_tracks = {
        "count": 0,
        "tracks": []
    }
    
    for track in tracks:
        song_name = track.get('name', 'Unknown')
        artist_name = track.get('artists', ['Unknown'])[0]
        
        try:
            # Búsqueda más robusta
            search_string = f"{song_name} {artist_name}"
            search_results = ytmusic.search(search_string, filter="songs")
            
            # Verificamos si hay resultados antes de acceder al índice [0]
            if search_results and len(search_results) > 0:
                video_id = search_results[0]["videoId"]
                video_ids.append(video_id)
            else:
                # Si no encuentra nada, lanzamos una excepción controlada para que vaya al except
                raise Exception("No results found")
                
        except Exception as e:
            logger.warning(f"Could not find track: {song_name} by {artist_name}. Error: {str(e)}")
            missed_tracks["count"] += 1
            missed_tracks["tracks"].append(f"{song_name} - {artist_name}")

    logger.info(f"Found {len(video_ids)} songs on YouTube Music")
    
    if len(video_ids) == 0:
        raise Exception("No songs were found on YouTube Music. Please check if the playlist contains valid songs.")
        
    return video_ids, missed_tracks

def create_ytm_playlist(playlist_link, headers_raw):
    # Creamos un archivo temporal para esta petición específica
    # Esto evita que dos usuarios se pisen el archivo 'header_auth.json'
    with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.json') as temp_auth_file:
        auth_filepath = temp_auth_file.name

    try:
        # 1. Configuración de Auth (Solución al bug de Chrome)
        # ytmusicapi.setup espera recibir los headers crudos y escribe en el archivo
        logger.info("Setting up YouTube Music Auth...")
        
        # Intentamos limpiar los headers si vienen con comillas extra o espacios
        headers_clean = headers_raw.strip()
        
        # setup() escribe las credenciales en el archivo temporal
        ytmusicapi.setup(filepath=auth_filepath, headers_raw=headers_clean)
        
        # 2. Inicializar Cliente
        ytmusic = YTMusic(auth=auth_filepath)
        
        # 3. Obtener datos de Spotify
        logger.info("Fetching Spotify tracks...")

        tracks = get_all_tracks(playlist_link) 
        
        name = get_playlist_name(playlist_link)
        
        # 4. Buscar canciones en YT Music
        logger.info(f"Searching for {len(tracks)} tracks on YTM...")
        video_ids, missed_tracks = get_video_ids(ytmusic, tracks)
        
        # 5. Crear Playlist
        logger.info(f"Creating playlist '{name}'...")
        # create_playlist devuelve el ID de la playlist creada o un dict
        playlist_id = ytmusic.create_playlist(name, "Created with LinkList", "PUBLIC", video_ids)
        
        logger.info(f"Playlist created successfully! ID: {playlist_id}")
        return missed_tracks

    except Exception as e:
        logger.error(f"Error in create_ytm_playlist: {str(e)}")
        # Re-lanzamos la excepción para que el main.py la capture y la mande al frontend
        raise e
        
    finally:
        # 6. LIMPIEZA (Muy Importante)
        # Borramos el archivo temporal de credenciales pase lo que pase
        if os.path.exists(auth_filepath):
            os.remove(auth_filepath)
            logger.info("Temporary auth file deleted.")