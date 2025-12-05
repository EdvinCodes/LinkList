import os
import requests
import logging
import re
import base64
from dotenv import load_dotenv

load_dotenv()

# Configurar logger
logger = logging.getLogger(__name__)

def get_headers(token):
    return {"Authorization": f"Bearer {token}"}

def get_spotify_access_token():
    client_id = os.getenv('SPOTIPY_CLIENT_ID')
    client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')

    if not client_id or not client_secret:
        raise Exception("Missing SPOTIPY_CLIENT_ID or SPOTIPY_CLIENT_SECRET in .env file")

    url = "https://accounts.spotify.com/api/token"
    
    # La forma estándar de enviar credenciales es Authorization header en base64
    auth_str = f"{client_id}:{client_secret}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status() # Lanza error si no es 200
        return response.json()["access_token"]
    except Exception as e:
        logger.error(f"Failed to get Spotify Token: {str(e)}")
        raise Exception("Failed to authenticate with Spotify")

def extract_playlist_id(playlist_url):
    # Usamos Regex para capturar el ID limpiamente
    # Soporta: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
    match = re.search(r"playlist/([a-zA-Z0-9]+)", playlist_url)
    if match:
        return match.group(1)
    else:
        raise Exception("Invalid Spotify Playlist URL. Could not extract ID.")

def get_all_tracks(link, market="US"):
    try:
        playlist_id = extract_playlist_id(link)
        access_token = get_spotify_access_token()
        
        # Endpoint directo a los tracks para paginación fácil
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?market={market}&limit=100"
        headers = get_headers(access_token)
        
        all_tracks = []
        
        logger.info(f"Fetching tracks for playlist {playlist_id}...")

        while url:
            response = requests.get(url, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"Spotify API Error: {response.text}")
                raise Exception(f"Spotify API returned {response.status_code}")

            data = response.json()
            
            for item in data.get("items", []):
                track = item.get("track")
                # Filtramos tracks locales, nulos o con restricciones
                if not track or track.get("is_local"):
                    continue
                
                # Extraemos solo lo necesario
                track_info = {
                    "name": track["name"],
                    "artists": [artist["name"] for artist in track["artists"]],
                    "album": track["album"]["name"],
                    "duration_ms": track["duration_ms"]
                }
                all_tracks.append(track_info)
            
            # Paginación: Spotify devuelve 'next' como URL o None (null en JSON)
            url = data.get("next")
            
        logger.info(f"Successfully fetched {len(all_tracks)} tracks from Spotify.")
        return all_tracks

    except Exception as e:
        logger.error(f"Error in get_all_tracks: {str(e)}")
        raise e

def get_playlist_name(link):
    try:
        playlist_id = extract_playlist_id(link)
        access_token = get_spotify_access_token()
        
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
        headers = get_headers(access_token)
        
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            raise Exception("Could not fetch playlist details")
            
        data = response.json()
        return data.get("name", "Untitled Playlist")
        
    except Exception as e:
        logger.error(f"Error getting playlist name: {str(e)}")
        return "LinkList Import" # Fallback seguro