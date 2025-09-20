from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/manifest.webmanifest")
def manifest():
    return send_from_directory(app.static_folder, "manifest.webmanifest", mimetype="application/manifest+json")

@app.route("/service-worker.js")
def sw():
    return send_from_directory(app.static_folder, "service-worker.js", mimetype="application/javascript")

if __name__ == "__main__":
    # HTTPS is required for many sensor APIs except on localhost.
    app.run(host="0.0.0.0", port=5000, debug=True, ssl_context="adhoc")
