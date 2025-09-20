# findalways — Sensor PWA (Flask)

A Progressive Web App that asks for permission and reads:
- Compass heading (via DeviceOrientation; uses `webkitCompassHeading` on iOS if available)
- Accelerometer & gyroscope (via DeviceMotion)
- Raw magnetometer (Chromium Generic Sensor API, not in Safari)
- GPS (Geolocation API; requires HTTPS)

## Quick start (local HTTPS)
```bash
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install flask
python app.py
```
Open on desktop: https://localhost:5000

On your phone (same Wi‑Fi): browse to `https://<your-computer-LAN-IP>:5000` and accept the self‑signed cert.

## One-command phone testing (public URL)
### Option A: Cloudflare Tunnel (recommended, free)
1) Install cloudflared:
- macOS: `brew install cloudflared`
- Ubuntu/Debian: `curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg` then follow Cloudflare docs to add repo & `sudo apt install cloudflared`
- Windows: download installer from Cloudflare docs

2) In one terminal: `python app.py`  
3) In another terminal:
```bash
chmod +x scripts/tunnel-cloudflared.sh
./scripts/tunnel-cloudflared.sh
```
Copy the **https** URL it prints and open it on your iPhone.

### Option B: ngrok
1) Install ngrok and sign in once: https://ngrok.com/download  
2) In one terminal: `python app.py`  
3) In another terminal:
```bash
chmod +x scripts/tunnel-ngrok.sh
./scripts/tunnel-ngrok.sh
```
Open the forwarded **https** URL on your phone.

## iOS specifics
- iOS Safari requires a user gesture before motion/orientation events. Tap **Enable Sensors** once per load.
- Magnetometer API is not available in Safari; heading is computed from orientation or `webkitCompassHeading` if provided.
- For installability: tap the **Install App** button (or Add to Home Screen).

## PWA notes
- Served manifest at `/manifest.webmanifest` and service worker at `/service-worker.js` (root scope) so it’s 100% installable.
- Assets are cached for offline use after first load. Use a hard refresh to update.

## License
MIT
