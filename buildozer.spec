[app]
title = Sensors App
package.name = sensorsapp
package.domain = org.example
source.dir = .
source.include_exts = py,kv,txt,xml,md
version = 0.1.0

# Kivy + Plyer for sensors
requirements = python3,kivy,plyer

# Your main entrypoint
entrypoint = main.py

# Orientation and fullscreen
fullscreen = 0
orientation = portrait

# Android settings
android.api = 34
android.minapi = 23
android.ndk = 25b
android.archs = arm64-v8a, armeabi-v7a
android.permissions = ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION, INTERNET

# Bootstrap
android.bootstrap = sdl2

# Logging verbosity (0-2)
log_level = 2

# If you later need background GPS:
# android.permissions = FOREGROUND_SERVICE, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION, INTERNET
# and use a foreground service per p4a docs.

# Optional icons/splash:
# icon.filename = %(source.dir)s/icon.png
# presplash.filename = %(source.dir)s/presplash.png

[buildozer]
# Build debug APK:
#   buildozer -v android debug
# Install & run on device:
#   buildozer android deploy run
