import os
import requests
import logging
import re
import base64
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_headers(token):
    return {"Authorization": f"Bearer {token}"}

def get_spotify_access_token():
    client_id = os.getenv('SPOTIPY_CLIENT_ID')
    client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')

    if not client_id or not client_secret:
        raise Exception("Missing SPOTIPY_CLIENT_ID or SPOTIPY_CLIENT_SECRET")

    url = "https://accounts.spotify.com/api/token"
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
        logger.error(f"Error Token Spotify: {str(e)}")
        raise Exception("Failed to authenticate with Spotify")

def extract_playlist_id(playlist_url):
    url_limpia = playlist_url.strip()
    match = re.search(r"playlist[:/]([a-zA-Z0-9\-_]+)", url_limpia)
    
    if match:
        return match.group(1)
    else:
        try:
            return url_limpia.split("/playlist/")[1].split("?")[0]
        except:
            raise Exception("Invalid Spotify Playlist URL")

def get_all_tracks(link):
    try:
        playlist_id = extract_playlist_id(link)
        access_token = get_spotify_access_token()
        
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=100"
        headers = get_headers(access_token)

        all_tracks = []
        logger.info(f"📥 Getting tracks for: {playlist_id}")

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
                break

            for item in items:
                track = item.get("track")
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
            
        logger.info(f"✅ Total canciones: {len(all_tracks)}")
        return all_tracks

    except Exception as e:
        logger.error(f"🔥 Error en get_all_tracks: {str(e)}")
        raise e

def get_playlist_name(link):
    try:
        playlist_id = extract_playlist_id(link)
        access_token = get_spotify_access_token()
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
        headers = get_headers(access_token)
        
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return "LinkList Import"
        return response.json().get("name", "LinkList Import")
    except:
        return "LinkList Import"