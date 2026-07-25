"""
Convierte la app Flask en un sitio 100% estático (HTML + JSON + assets),
listo para subir a Netlify. No corre un servidor: solo escribe archivos
dentro de la carpeta build/.

Uso:
    python freeze.py

Esto es exactamente lo que Netlify ejecuta automáticamente en cada
despliegue (ver netlify.toml) — no hace falta correrlo a mano salvo que
quieras revisar el resultado en tu computadora antes de subirlo.
"""
from flask_frozen import Freezer
from app import app

app.config["FREEZER_DESTINATION"] = "build"
app.config["FREEZER_RELATIVE_URLS"] = True

freezer = Freezer(app)

if __name__ == "__main__":
    freezer.freeze()
    print("Listo. Sitio estático generado en build/")
