# Expose local HTTPS Flask server using ngrok (Windows PowerShell)
# Requirements: Install ngrok from https://ngrok.com/download
# Usage: Start Flask in another terminal: `python app.py`
# Then run: `powershell -ExecutionPolicy Bypass -File .\scripts\tunnel-ngrok.ps1`
ngrok.exe http https://localhost:5000
