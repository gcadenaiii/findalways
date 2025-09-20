from math import atan2, degrees
from kivy.app import App
from kivy.clock import Clock
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from plyer import accelerometer, gyroscope, compass, gps

class SensorUI(BoxLayout):
    def __init__(self, **kw):
        super().__init__(orientation="vertical", spacing=6, padding=12, **kw)
        self.lbl_head = Label(text="Heading: --°", font_size="24sp")
        self.lbl_acc  = Label(text="Accel: --, --, --")
        self.lbl_gyro = Label(text="Gyro: --, --, --")
        self.lbl_gps  = Label(text="GPS: --, -- (acc -- m)")

        self.add_widget(self.lbl_head)
        self.add_widget(self.lbl_acc)
        self.add_widget(self.lbl_gyro)
        self.add_widget(self.lbl_gps)

        # Enable sensors (will no-op on unsupported platforms, e.g., some desktops)
        try:
            accelerometer.enable()
        except Exception:
            self.lbl_acc.text = "Accel: unavailable"
        try:
            gyroscope.enable()
        except Exception:
            self.lbl_gyro.text = "Gyro: unavailable"
        try:
            compass.enable()
        except Exception:
            self.lbl_head.text = "Heading: (compass unavailable)"

        # GPS (works on Android & iOS via Plyer)
        try:
            gps.configure(on_location=self.on_location, on_status=lambda *a: None)
            gps.start(minTime=1000, minDistance=1)
        except Exception:
            self.lbl_gps.text = "GPS: unavailable on this device/simulator"

        Clock.schedule_interval(self.update, 1/10)  # 10 Hz

    def on_location(self, **kwargs):
        lat = kwargs.get("lat")
        lon = kwargs.get("lon")
        acc = kwargs.get("accuracy")
        if lat is not None and lon is not None:
            acc_str = f" (acc {acc:.1f} m)" if acc is not None else ""
            self.lbl_gps.text = f"GPS: {lat:.6f}, {lon:.6f}{acc_str}"
        else:
            self.lbl_gps.text = "GPS: --, --"

    def _heading_from_field(self, field):
        # field is (x, y, z) in µT; heading from X,Y plane
        try:
            if not field or field[0] is None or field[1] is None:
                return None
            x, y = field[0], field[1]
            hdg = (degrees(atan2(y, x)) + 360.0) % 360.0
            return hdg
        except Exception:
            return None

    def update(self, dt):
        # Accelerometer
        try:
            acc = accelerometer.acceleration
            if acc and acc[0] is not None:
                self.lbl_acc.text = f"Accel: {acc[0]:.2f}, {acc[1]:.2f}, {acc[2]:.2f}"
        except Exception:
            pass

        # Gyroscope
        try:
            if hasattr(gyroscope, "rotation"):
                gyr = gyroscope.rotation
            else:
                gyr = gyroscope.orientation
            if gyr and gyr[0] is not None:
                self.lbl_gyro.text = f"Gyro:  {gyr[0]:.2f}, {gyr[1]:.2f}, {gyr[2]:.2f}"
        except Exception:
            pass

        # Compass (magnetometer)
        try:
            fld = getattr(compass, "field", None)
            heading = self._heading_from_field(fld)
            if heading is not None:
                self.lbl_head.text = f"Heading: {heading:.1f}°"
        except Exception:
            pass

class SensorApp(App):
    def build(self):
        return SensorUI()

if __name__ == "__main__":
    SensorApp().run()
