import multiprocessing

# Server socket
bind = "0.0.0.0:8080"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
# IMPORTANTE: 15 minutos de timeout para permitir playlists grandes
timeout = 900

# Worker settings
max_requests = 1000
max_requests_jitter = 50
keepalive = 500 

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'linklist-api'

# Production settings
reload = False
preload_app = True