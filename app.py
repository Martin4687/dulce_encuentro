from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

app = Flask(__name__)
app.secret_key = "clave-de-demostracion-cambiar-en-produccion"

# Fecha de la gran apertura de la nueva sucursal.
# El frontend usa esto para armar la cuenta regresiva.
APERTURA = datetime(2026, 8, 15, 10, 0, 0)

SABORES = [
    {"nombre": "Lemon Pie", "descripcion": "Helado de limón con base de galleta y merengue tostado.",
     "precio": 18, "color": "#FFC93C", "nuevo": True},
    {"nombre": "Cappuccino Granizado", "descripcion": "Café intenso con trocitos de chocolate crocante.",
     "precio": 19, "color": "#B5773E", "nuevo": True},
    {"nombre": "Frutilla al Agua", "descripcion": "Fresco, ligero y con trozos reales de frutilla.",
     "precio": 16, "color": "#FF6FA0", "nuevo": True},
    {"nombre": "Chocolate Suizo", "descripcion": "Receta clásica con chocolate belga 55%.",
     "precio": 18, "color": "#6B4226", "nuevo": False},
    {"nombre": "Dulce de Leche Granizado", "descripcion": "El favorito de siempre, con crocante de barquillo.",
     "precio": 17, "color": "#D98E3C", "nuevo": False},
    {"nombre": "Menta Chip", "descripcion": "Menta fresca con chips de chocolate semi-amargo.",
     "precio": 17, "color": "#3DDC97", "nuevo": False},
    {"nombre": "Maracuyá", "descripcion": "Ácido y tropical, hecho con pulpa de fruta real.",
     "precio": 17, "color": "#FF9F1C", "nuevo": False},
    {"nombre": "Oreo Cookies", "descripcion": "Cremoso, con galleta Oreo triturada en cada cucharada.",
     "precio": 18, "color": "#2A1541", "nuevo": False},
]

GALERIA = [
    {
        "id": 1,
        "categoria": "sabores",
        "titulo": "Nuestra vitrina de sabores",
        "descripcion": "Preparamos cada sabor a mano, todas las mañanas.",
        "imagen": "vitrina-sabores.jpg",
    },
    {
        "id": 2,
        "categoria": "sucursal",
        "titulo": "Así lucirá la sucursal de Sopocachi",
        "descripcion": "Un espacio pensado para quedarte a disfrutar, no solo para llevar.",
        "imagen": "interior-sucursal.jpg",
    },
    {
        "id": 3,
        "categoria": "sabores",
        "titulo": "Pistacho con salsa de frambuesa",
        "descripcion": "Uno de los sabores más pedidos en nuestra sucursal original.",
        "imagen": "sabor-destacado.jpg",
    },
    {
        "id": 4,
        "categoria": "promos",
        "titulo": "Los sabores que estrenamos",
        "descripcion": "Lemon Pie, Cappuccino Granizado y Frutilla al Agua, solo por la apertura.",
        "imagen": "promo-nuevos-sabores.jpg",
    },
]

SUCURSAL = {
    "nombre": "Dulce Encuentro — Sopocachi",
    "direccion": "Av. 6 de Agosto esq. Aspiazu, Sopocachi, La Paz",
    "horario_apertura": "Sábado 15 de agosto, 10:00",
    "horario_regular": "Todos los días, 11:00 – 21:30",
    "whatsapp": "+591 700 00 000",
}


@app.route("/", methods=["GET", "POST"])
def inicio():
    # El formulario de contacto envía su POST a "/" (la misma página) a
    # propósito: es el patrón que espera Netlify Forms cuando el sitio se
    # despliega como estático, y también funciona perfecto en local con
    # Flask corriendo de verdad. Ver la Guía de Netlify para el detalle.
    if request.method == "POST":
        return _procesar_contacto()

    nuevos = [s for s in SABORES if s["nuevo"]]
    clasicos = [s for s in SABORES if not s["nuevo"]]
    return render_template(
        "index.html",
        sabores_nuevos=nuevos,
        sabores_clasicos=clasicos,
        sucursal=SUCURSAL,
        apertura_iso=APERTURA.isoformat(),
    )


def _procesar_contacto():
    nombre = request.form.get("nombre", "").strip()
    mensaje = request.form.get("mensaje", "").strip()

    if not nombre or not mensaje:
        flash("Por favor completa tu nombre y tu mensaje antes de enviar.", "error")
        return redirect(url_for("inicio") + "#visitanos")

    flash(f"¡Gracias, {nombre}! Te esperamos en la apertura.", "success")
    return redirect(url_for("inicio") + "#visitanos")


@app.route("/api/sabores.json")
def api_sabores():
    """Alimenta al componente de React con los datos de sabores en JSON."""
    return jsonify(SABORES)


@app.route("/api/galeria.json")
def api_galeria():
    """Alimenta a la galería interactiva de React en JSON."""
    galeria_con_url = [
        {**item, "imagen": url_for("static", filename=f"img/{item['imagen']}")}
        for item in GALERIA
    ]
    return jsonify(galeria_con_url)


if __name__ == "__main__":
    app.run(debug=True)