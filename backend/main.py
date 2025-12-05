import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from ytm import create_ytm_playlist

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
CORS(app, resources={
    r"/*": {
        "origins": [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/create', methods=['POST'])
def create_playlist():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data"}), 400
            
        playlist_link = data.get('playlist_link')
        auth_headers = data.get('auth_headers')

        if not playlist_link or not auth_headers:
            return jsonify({"message": "Missing link or headers"}), 400

        logger.info(f"Processing playlist...")
        missed_tracks = create_ytm_playlist(playlist_link, auth_headers)

        return jsonify({
            "message": "Playlist created successfully!",
            "missed_tracks": missed_tracks
        }), 200

    except Exception as e:
        logger.error(f"Server Error: {str(e)}", exc_info=True)
        return jsonify({"message": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "online"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)