let deferredPrompt = null;
const installBtn = document.getElementById('install');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

const statusEl = document.getElementById('status');
const headingEl = document.getElementById('heading');
const motionEl = document.getElementById('motion');
const magEl = document.getElementById('mag');
const gpsEl = document.getElementById('gps');
const needle = document.getElementById('needle');

const latest = { acc: null, gyro: null, compass: null, magnetometer: null, gps: null };

function logState() {
  headingEl.textContent = (latest.compass != null) ? `${Math.round(latest.compass)}°` : '—';
  motionEl.textContent =
    `acc: ${latest.acc ? JSON.stringify(latest.acc) : '—'}\n` +
    `gyro: ${latest.gyro ? JSON.stringify(latest.gyro) : '—'}`;
  magEl.textContent = latest.magnetometer ? JSON.stringify(latest.magnetometer) : '—';
  gpsEl.textContent = latest.gps ? JSON.stringify(latest.gps) : '—';

  if (latest.compass != null) {
    needle.style.transform = `translate(-50%,-70px) rotate(${latest.compass}deg)`;
  }
}

function compassHeading(alpha, beta, gamma) {
  const degtorad = Math.PI / 180;
  const _x = (beta || 0) * degtorad;
  const _y = (gamma || 0) * degtorad;
  const _z = (alpha || 0) * degtorad;

  const cX = Math.cos(_x), cY = Math.cos(_y), cZ = Math.cos(_z);
  const sX = Math.sin(_x), sY = Math.sin(_y), sZ = Math.sin(_z);

  const Vx = -cZ * sY - sZ * sX * cY;
  const Vy = -sZ * sY + cZ * sX * cY;
  let heading = Math.atan2(Vx, Vy);
  if (heading < 0) heading += 2 * Math.PI;
  return heading * (180 / Math.PI);
}

async function requestMotionPermissionsIfNeeded() {
  const needMotionPerm = typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function';
  const needOrientPerm = typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function';

  if (needMotionPerm) {
    try { await DeviceMotionEvent.requestPermission(); } catch(e) { console.warn('Motion perm error:', e); }
  }
  if (needOrientPerm) {
    try { await DeviceOrientationEvent.requestPermission(); } catch(e) { console.warn('Orient perm error:', e); }
  }
}

function startOrientation() {
  const onOrientation = (e) => {
    const iosCompass = (typeof e.webkitCompassHeading === 'number') ? e.webkitCompassHeading : null;
    let heading = null;
    if (iosCompass != null && !Number.isNaN(iosCompass)) {
      heading = iosCompass;
    } else if (typeof e.alpha === 'number' && typeof e.beta === 'number' && typeof e.gamma === 'number') {
      heading = compassHeading(e.alpha, e.beta, e.gamma);
    }
    latest.compass = heading;
  };

  if ('ondeviceorientationabsolute' in window) {
    window.addEventListener('deviceorientationabsolute', onOrientation, true);
  }
  window.addEventListener('deviceorientation', onOrientation, true);
}

function startMotion() {
  window.addEventListener('devicemotion', (e) => {
    const acc = e.accelerationIncludingGravity || e.acceleration;
    const rot = e.rotationRate;
    latest.acc = acc ? {x: acc.x, y: acc.y, z: acc.z} : null;
    latest.gyro = rot ? {alpha: rot.alpha, beta: rot.beta, gamma: rot.gamma} : null;
  }, true);
}

let mag = null;
function tryStartMagnetometer() {
  if ('Magnetometer' in window) {
    try {
      mag = new Magnetometer({frequency: 10});
      mag.addEventListener('reading', () => {
        latest.magnetometer = {x: mag.x, y: mag.y, z: mag.z};
      });
      mag.addEventListener('error', (e) => {
        latest.magnetometer = {error: e.error ? e.error.name : String(e)};
      });
      mag.start();
    } catch (err) {
      latest.magnetometer = {error: String(err)};
    }
  } else {
    latest.magnetometer = {info: 'Magnetometer API not available (e.g., Safari)'};
  }
}

function requestGeolocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        latest.gps = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy };
        logState();
      },
      (err) => { latest.gps = {error: err.message}; logState(); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    latest.gps = {error: 'Geolocation not supported'};
  }
}

document.getElementById('enable').addEventListener('click', async () => {
  statusEl.textContent = 'Requesting permissions…';
  await requestMotionPermissionsIfNeeded();
  startOrientation();
  startMotion();
  tryStartMagnetometer();
  requestGeolocation();
  statusEl.textContent = 'Sensors active.';
});

setInterval(logState, 200);
