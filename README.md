# Dulce Encuentro — Landing de apertura de sucursal (demo de portafolio)

Segundo ejemplo de portafolio: una landing page más compleja, para promocionar
la apertura de una nueva sucursal de heladería. Construida con **Flask** en el
backend y un componente de **React** para la parte más interactiva (la
galería con filtros y lightbox).

## Qué demuestra este proyecto (más allá de Nevado)

- **Flask como API JSON**, no solo como servidor de HTML: `/api/sabores` y
  `/api/galeria` devuelven datos en JSON, que el frontend consume con
  `fetch()`. Es el mismo patrón que vas a usar para conectar el sistema de
  inventario a una interfaz web.
- **Un componente de React real** (galería con filtros por categoría +
  modal/lightbox), montado sobre una sola sección de la página — el resto
  del sitio sigue siendo HTML renderizado por Flask/Jinja2. No hace falta
  convertir todo el sitio a React para usarlo donde realmente aporta
  interactividad.
- React y ReactDOM están **vendorizados localmente** (`static/js/vendor/`),
  no cargados desde un CDN externo — así la demo funciona igual de rápido y
  no depende de que un servicio externo esté disponible.
- Diseño más "maximalista": marquee animado, cuenta regresiva en vivo,
  stickers rotados, confetti al enviar el formulario, y un divisor a rayas
  tipo caramelo hecho en CSS puro (sin imágenes).

## Cómo correrlo (desarrollo local)

```bash
python3 -m venv venv
source venv/bin/activate        # En Windows: venv\Scripts\activate
pip install -r requirements.txt
flask --app app run --debug
```

Abre `http://127.0.0.1:5000`.

## Cómo publicarlo (Netlify)

Este proyecto está preparado para desplegarse en Netlify como sitio
estático — el comando `python freeze.py` convierte la app Flask en HTML/JSON
puro antes de publicar. La guía completa paso a paso está en
`GUIA-NETLIFY-GITHUB.md`.


## Estructura

```
dulce-encuentro/
├── app.py                        # Rutas HTML + API JSON (/api/sabores.json, /api/galeria.json)
├── freeze.py                     # Convierte la app a HTML/JSON estático (para Netlify)
├── netlify.toml                  # Configuración de build para Netlify
├── requirements.txt
├── GUIA-NETLIFY-GITHUB.md        # Guía paso a paso de despliegue
├── templates/
│   └── index.html
└── static/
    ├── css/style.css             # Todo el diseño
    ├── img/                      # Las 4 imágenes del cliente
    └── js/
        ├── main.js               # Menú móvil, cuenta regresiva, confetti, envío del formulario
        ├── gallery.js            # Componente de React (galería + lightbox)
        └── vendor/                # React y ReactDOM (builds locales, sin CDN)
```

## Ideas para seguir personalizando

- Los sabores y la fecha de apertura están en `app.py` (`SABORES`, `APERTURA`,
  `SUCURSAL`) — cambiarlos ahí actualiza toda la página, incluida la cuenta
  regresiva.
- La galería (`/api/galeria.json`) es fácil de extender: solo agrega otro
  diccionario a la lista `GALERIA` con una imagen nueva en `static/img/`.
- El componente de React (`gallery.js`) está escrito sin JSX (con
  `React.createElement` directo) para que corra sin paso de build. Si más
  adelante quieres usar JSX de verdad, el siguiente paso natural es
  introducir Vite o Create React App para esa parte del frontend.
- El formulario de contacto envía su POST a `/` a propósito (no a `/contacto`)
  — es el patrón que usa Netlify Forms para detectar envíos en un sitio
  estático. El detalle completo está en `GUIA-NETLIFY-GITHUB.md`.