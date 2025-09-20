#!/usr/bin/env bash
# Expose your local HTTPS Flask server to the internet using Cloudflare Tunnel.
# Requires: cloudflared (https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)
# Usage: first run `python app.py` in another terminal, then:
#   ./scripts/tunnel-cloudflared.sh
set -euo pipefail
cloudflared tunnel --url https://localhost:5000
