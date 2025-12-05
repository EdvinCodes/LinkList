import os
import tempfile
import logging
import ytmusicapi
from ytmusicapi import YTMusic
from spotify import get_all_tracks, get_playlist_name

logger = logging.getLogger(__name__)

def sanitize_headers(headers_raw):
    """
    Limpia los headers pegados desde Chrome (HTTP/2) para que funcionen en Python.
    Elimina las líneas que empiezan por ':' (:authority, :method, etc.)
    """
    if not headers_raw:
        return ""
        
    lines = headers_raw.strip().split('\n')
    # Filtramos las líneas que empiezan por ':' (pseudo-headers de HTTP/2)
    clean_lines = [line for line in lines if not line.strip().startswith(':')]
    return '\n'.join(clean_lines)

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
            # Búsqueda
            search_string = f"{song_name} {artist_name}"
            search_results = ytmusic.search(search_string, filter="songs")
            
            if search_results and len(search_results) > 0:
                video_id = search_results[0]["videoId"]
                video_ids.append(video_id)
            else:
                raise Exception("No results found")
                
        except Exception as e:
            logger.warning(f"Could not find track: {song_name} - {artist_name}. Error: {str(e)}")
            missed_tracks["count"] += 1
            missed_tracks["tracks"].append(f"{song_name} - {artist_name}")

    logger.info(f"Found {len(video_ids)} songs on YouTube Music")
    
    if len(video_ids) == 0:
        raise Exception("No songs were found on YouTube Music. Please check if the playlist contains valid songs.")
        
    return video_ids, missed_tracks

def create_ytm_playlist(playlist_link, headers_raw):
    with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.json') as temp_auth_file:
        auth_filepath = temp_auth_file.name

    try:
        logger.info("Sanitizing headers...")
        # 🛠️ AQUI ESTÁ LA MAGIA: Limpiamos los headers de Chrome
        headers_clean = sanitize_headers(headers_raw)
        
        logger.info("Setting up YouTube Music Auth...")
        ytmusicapi.setup(filepath=auth_filepath, headers_raw=headers_clean)
        
        ytmusic = YTMusic(auth=auth_filepath)
        
        logger.info("Fetching Spotify tracks...")
        # Usamos "US" por defecto para minimizar errores 404
        tracks = get_all_tracks(playlist_link) 
        name = get_playlist_name(playlist_link)
        
        logger.info(f"Searching for {len(tracks)} tracks on YTM...")
        video_ids, missed_tracks = get_video_ids(ytmusic, tracks)
        
        logger.info(f"Creating playlist '{name}'...")
        playlist_id = ytmusic.create_playlist(name, "Created with LinkList", "PUBLIC", video_ids)
        
        return missed_tracks

    except Exception as e:
        logger.error(f"Error in create_ytm_playlist: {str(e)}")
        raise e
        
    finally:
        if os.path.exists(auth_filepath):
            os.remove(auth_filepath)
            logger.info("Temporary auth file deleted.")