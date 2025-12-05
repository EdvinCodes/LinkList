import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Importamos la lógica (que revisaremos luego)
from ytm import create_ytm_playlist

# Configuración inicial
load_dotenv()

# Configurar Logging (Para ver errores reales en la consola)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuración de CORS más robusta
# En desarrollo, a veces queremos permitir todo o especificar localhost
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173') # Valor por defecto de Vite
CORS(app, resources={
    r"/*": {
        "origins": [frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/create', methods=['POST'])
def create_playlist():
    try:
        # 1. Validación de Entrada
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data provided"}), 400
            
        playlist_link = data.get('playlist_link')
        auth_headers = data.get('auth_headers')

        if not playlist_link or not auth_headers:
            return jsonify({"message": "Missing 'playlist_link' or 'auth_headers'"}), 400

        logger.info(f"Processing playlist: {playlist_link}")

        # 2. Llamada a la lógica principal
        # Aquí es donde ocurre la magia (y los errores de Chrome)
        missed_tracks = create_ytm_playlist(playlist_link, auth_headers)

        return jsonify({
            "message": "Playlist created successfully!",
            "missed_tracks": missed_tracks
        }), 200

    except Exception as e:
        # Logueamos el error completo en la consola del servidor
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        
        # Devolvemos un mensaje genérico al usuario (o el error si estamos en dev)
        return jsonify({"message": f"Server Error: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "online",
        "message": "LinkList Server is running 🚀"
    }), 200

if __name__ == '__main__':
    # Usamos el puerto de la variable de entorno o 8080 por defecto
    port = int(os.getenv('PORT', 8080))
    # debug=True ayuda mucho en desarrollo para ver los cambios sin reiniciar
    app.run(host='0.0.0.0', port=port, debug=True)