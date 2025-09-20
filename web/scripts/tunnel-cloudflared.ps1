# Expose local HTTPS Flask server using Cloudflare Tunnel (Windows PowerShell)
# Requirements: Install cloudflared from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
# Usage: Start Flask in another terminal: `python app.py`
# Then run: `powershell -ExecutionPolicy Bypass -File .\scripts\tunnel-cloudflared.ps1`
cloudflared.exe tunnel --url https://localhost:5000
