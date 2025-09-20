#!/usr/bin/env bash
# Expose your local HTTPS Flask server using ngrok.
# Requires: ngrok (https://ngrok.com/download)
# Usage: first run `python app.py`, then:
#   ./scripts/tunnel-ngrok.sh
set -euo pipefail
ngrok http https://localhost:5000
