# Kivy Sensors Starter (Android & iOS)

A minimal **Kivy + Plyer** starter that reads **accelerometer**, **gyroscope**, **GPS**, and **compass (magnetometer)** from a phone. 
Focus is on **iOS** setup; Android can be packaged with Buildozer/python-for-android.

## What’s inside
- `main.py` — the Kivy app reading sensors via **Plyer**
- `ios/Info.plist.snippet.xml` — privacy keys you must add in your iOS app
- `buildozer.spec` — Android packaging config (Buildozer)
- `.gitignore`

---

## Run on Desktop (for quick UI check)
Some sensors won’t be available on desktop—this is just for sanity checks.

```bash
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

---

## iOS: Build & run on your iPhone

### Prerequisites
- macOS + **Xcode** (latest)
- A free or paid Apple Developer account (for code signing)
- Python 3.10+ (a recent CPython) installed
- **kivy-ios** toolchain

### 1) Install `kivy-ios`
```bash
python3 -m pip install --upgrade pip wheel
python3 -m pip install kivy-ios
python3 -m pip install "cython<3.1"
```

### 2) Build iOS recipes
```bash
kivy-ios build python3
kivy-ios build kivy
kivy-ios build plyer
kivy-ios build sdl2 sdl2_image sdl2_mixer sdl2_ttf
```

### 3) Create an iOS Xcode project
```bash
kivy-ios create sensors_app org.example.sensors "Sensors App" --project-dir ios
```

### 4) Add your app code to the template
```bash
APP_DIR="ios/sensors_app/sensors_app"
mkdir -p "$APP_DIR"
cp main.py "$APP_DIR/"
```

### 5) Add iOS privacy keys
Open `ios/sensors_app/Info.plist` and add the keys from `ios/Info.plist.snippet.xml`:

- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription` (optional)
- `NSMotionUsageDescription`

### 6) Open in Xcode, set signing, and run
```bash
open ios/sensors_app/"Sensors App".xcodeproj
```

Choose your Team, select your iPhone, and Run. Accept permissions on device.

---

## Android (Buildozer)
Basic flow:
```bash
python3 -m pip install buildozer
buildozer -v android debug
# then, to install and run on a plugged-in device:
buildozer android deploy run logcat
```

---

## Troubleshooting
- **Compass blank**: calibrate (figure‑8), ensure `NSMotionUsageDescription` present on iOS.
- **GPS None**: simulator won’t provide real data; test on device and grant location permission.
- **Android build fails**: try `buildozer android clean` and ensure Android SDK/NDK are downloaded.

---

## License
MIT
