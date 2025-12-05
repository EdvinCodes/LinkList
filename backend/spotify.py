import os
import requests
import logging
import re
import base64
from dotenv import load_dotenv

load_dotenv()

# Configurar logger para ver todo lo que pasa
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_headers(token):
    return {"Authorization": f"Bearer {token}"}

def get_spotify_access_token():
    client_id = os.getenv('SPOTIPY_CLIENT_ID')
    client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')

    if not client_id or not client_secret:
        logger.error("❌ Faltan las credenciales de Spotify en .env")
        raise Exception("Missing SPOTIPY_CLIENT_ID or SPOTIPY_CLIENT_SECRET")

    url = "https://accounts.spotify.com/api/token"
    
    # Codificación estándar en Base64 para la API de Spotify
    auth_str = f"{client_id}:{client_secret}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        logger.error(f"❌ Error obteniendo token de Spotify: {str(e)}")
        if 'response' in locals():
             logger.error(f"Respuesta Spotify: {response.text}")
        raise Exception("Failed to authenticate with Spotify")

def extract_playlist_id(playlist_url):
    # 1. Limpieza básica
    url_limpia = playlist_url.strip()
    
    # 2. Regex robusto: Busca después de "playlist/" o "playlist:"
    # Acepta alfanuméricos, guiones y guiones bajos (Base62 estándar)
    match = re.search(r"playlist[:/]([a-zA-Z0-9\-_]+)", url_limpia)
    
    if match:
        playlist_id = match.group(1)
        logger.info(f"✅ ID extraído: {playlist_id}")
        return playlist_id
    else:
        # Fallback manual mejorado
        try:
            # Dividimos por 'playlist/' y tomamos la parte derecha
            part = url_limpia.split("/playlist/")[1]
            # Limpiamos query params (?) y slashes finales (/)
            playlist_id = part.split("?")[0].split("/")[0]
            
            if len(playlist_id) > 0:
                logger.info(f"✅ ID extraído (fallback): {playlist_id}")
                return playlist_id
            else:
                raise Exception("Empty ID")
        except:
            logger.error(f"❌ No se pudo extraer ID de: {playlist_url}")
            raise Exception("Invalid Spotify Playlist URL. Could not extract ID.")

def get_all_tracks(link):
    try:
        playlist_id = extract_playlist_id(link)
        access_token = get_spotify_access_token()
        
        # Quitamos el parámetro market para evitar restricciones regionales forzadas
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=100"
        headers = get_headers(access_token)
        
        all_tracks = []
        
        logger.info(f"🔍 Requesting Spotify API: {url}") # LOG IMPORTANTE

        while url:
            response = requests.get(url, headers=headers)
            
            if response.status_code != 200:
                # Si falla aquí, mira la URL impresa arriba ⬆️
                logger.error(f"❌ Error API Spotify ({response.status_code}) en URL: {url}")
                logger.error(f"Respuesta: {response.text}")
                
                if response.status_code == 404:
                    raise Exception("Spotify API Error: 404 (Playlist Not Found or Private)")
                
                raise Exception(f"Spotify API Error: {response.status_code}")

            data = response.json()
            items = data.get("items")
            
            if items is None:
                logger.error(f"⚠️ Estructura inesperada: {data.keys()}")
                break

            for item in items:
                track = item.get("track")
                # Filtramos tracks locales, nulos o con restricciones
                if not track or track.get("is_local"):
                    continue
                
                track_info = {
                    "name": track["name"],
                    "artists": [artist["name"] for artist in track["artists"]],
                    "album": track["album"]["name"],
                    "duration_ms": track["duration_ms"]
                }
                all_tracks.append(track_info)
            
            url = data.get("next")
            
        logger.info(f"✅ Total canciones encontradas: {len(all_tracks)}")
        return all_tracks

    except Exception as e:
        logger.error(f"🔥 CRASH en get_all_tracks: {str(e)}")
        raise e

def get_playlist_name(link):
    try:
        playlist_id = extract_playlist_id(link)
        access_token = get_spotify_access_token()
        
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
        headers = get_headers(access_token)
        
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"Error obteniendo nombre playlist ({response.status_code}): {response.text}")
            return "LinkList Import"
            
        data = response.json()
        return data.get("name", "LinkList Import")
        
    except Exception as e:
        logger.warning(f"No se pudo obtener nombre playlist: {str(e)}")
        return "LinkList Import"