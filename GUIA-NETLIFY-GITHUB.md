# Guía: subir Dulce Encuentro a Netlify usando GitHub

## Antes de empezar: por qué esto no es "solo subir la carpeta"

Netlify **no ejecuta Flask** (ni ningún servidor Python persistente). Netlify
sirve dos cosas: archivos estáticos (HTML, CSS, JS, imágenes) y funciones
"serverless" sueltas. Tu proyecto tiene un backend real con rutas y un
formulario, así que ya lo adapté para que funcione en ambos mundos:

- **En tu computadora**, sigues trabajando exactamente igual, con
  `flask run` — nada de tu flujo de desarrollo cambia.
- **Para Netlify**, un comando (`python freeze.py`, usando la librería
  Frozen-Flask) convierte toda la app en archivos HTML y JSON estáticos.
  Netlify va a correr ese comando automáticamente cada vez que subas un
  cambio a GitHub — no lo tienes que hacer tú a mano.

El formulario de contacto también se adaptó: en vez de que Flask lo reciba,
ahora usa **Netlify Forms**, un servicio de Netlify que detecta formularios
HTML y los recibe sin que necesites ningún servidor corriendo. Ya está
todo configurado — no tienes que tocar código para que esto funcione.

---

## Paso 1: Crear el repositorio en GitHub

Si nunca usaste Git antes, es básicamente un "historial de cambios" de tu
proyecto — y GitHub es donde ese historial vive en la nube.

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes una.
2. Haz clic en el botón verde **"New"** (o el ícono `+` → "New repository").
3. Nómbralo, por ejemplo, `dulce-encuentro`.
4. Déjalo en **Public** (privado también funciona con Netlify, pero público
   es más simple para empezar).
5. **No marques** "Add a README" — ya tienes uno. Crea el repositorio vacío.
6. GitHub te va a mostrar una pantalla con comandos — no los necesitas
   copiar todavía, los de abajo son los mismos, explicados.

## Paso 2: Subir el proyecto desde tu computadora

Abre una terminal dentro de la carpeta `dulce-encuentro/` (la que descargaste
de esta conversación) y corre, uno por uno:

```bash
git init
git add .
git commit -m "Primera versión de Dulce Encuentro"
```

- `git init` convierte la carpeta en un repositorio Git (solo se hace una vez).
- `git add .` marca todos los archivos para guardarlos en el historial
  (respeta el `.gitignore` que ya incluí, así que no sube `venv/`,
  `__pycache__/` ni la carpeta `build/` — esas se regeneran solas).
- `git commit` guarda una "foto" de ese estado del proyecto, con un mensaje
  describiendo qué es.

Ahora conecta tu carpeta con el repositorio que creaste en GitHub:

```bash
git remote add origin https://github.com/TU-USUARIO/dulce-encuentro.git
git branch -M main
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu usuario real de GitHub (lo ves en la URL que
GitHub te mostró al crear el repositorio). La terminal te va a pedir tu
usuario y una contraseña — desde 2021 GitHub ya no acepta tu contraseña
normal ahí, así que si te la rechaza, sigue la
[guía oficial para crear un "personal access token"](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
y úsalo como contraseña la primera vez (tu computadora lo recuerda después).

Cuando termine, recarga la página de tu repositorio en GitHub — deberías ver
todos tus archivos ahí.

## Paso 3: Conectar Netlify con GitHub

1. Ve a [netlify.com](https://netlify.com) y crea una cuenta — el botón
   "Sign up with GitHub" es el camino más directo, porque de una vez
   autoriza la conexión entre ambos servicios.
2. En tu panel de Netlify, haz clic en **"Add new site" → "Import an existing
   project"**.
3. Elige **GitHub**, y autoriza el acceso si te lo pide.
4. Busca y selecciona el repositorio `dulce-encuentro`.
5. Netlify va a leer automáticamente el archivo `netlify.toml` que ya está
   en el proyecto, y va a mostrarte esto (ya viene precargado, no lo
   escribas a mano):
   - **Build command:** `pip install -r requirements.txt && python freeze.py`
   - **Publish directory:** `build`
6. Haz clic en **"Deploy site"**.

Netlify va a instalar Python, instalar Flask y Frozen-Flask, correr
`freeze.py`, y publicar el resultado. La primera vez tarda uno o dos
minutos — puedes ver el progreso en tiempo real en la pestaña "Deploys".

Cuando termine, Netlify te da una URL gratis tipo
`https://nombre-al-azar-123.netlify.app` — esa ya es tu sitio, en vivo.

## Paso 4: Confirmar que el formulario funciona (Netlify Forms)

Netlify detecta formularios automáticamente durante el build, buscando el
atributo `data-netlify="true"` en el HTML — que ya está en el formulario de
contacto. No necesitas configurar nada más.

Para comprobarlo:

1. Entra a tu sitio ya publicado (la URL `.netlify.app`).
2. Baja hasta "Visítanos" y envía el formulario de prueba.
3. En tu panel de Netlify, ve a **Site configuration → Forms**. Ahí vas a
   ver el envío registrado, con nombre y mensaje.

Si en algún momento quieres recibir esos envíos por correo, Netlify permite
activar notificaciones por email desde esa misma sección (Forms →
Notifications), sin tocar código.

## Paso 5: El flujo de trabajo de aquí en adelante

Esta es la parte más importante para el día a día: **una vez conectado,
Netlify vuelve a publicar el sitio solo cada vez que subes un cambio a
GitHub.** No hay que repetir el Paso 3.

Tu flujo, de ahora en más, va a ser:

```bash
# 1. Haces cambios en tu código localmente y los pruebas con:
flask --app app run --debug

# 2. Cuando estés conforme, subes los cambios:
git add .
git commit -m "Describe qué cambiaste"
git push

# 3. Netlify detecta el push automáticamente y republica el sitio
#    (revisa el progreso en la pestaña "Deploys" de tu panel de Netlify)
```

No necesitas correr `python freeze.py` tú mismo — eso es exactamente lo que
Netlify ejecuta en su servidor cada vez que detecta un `git push`. Tú solo
programas y usas Git; Netlify se encarga del resto.

## Paso 6 (opcional): un dominio con mejor nombre

Si más adelante quieres algo como `dulceencuentro.com` en vez de la URL
`.netlify.app`:

1. Compra el dominio en cualquier proveedor (Namecheap, GoDaddy, etc.).
2. En Netlify: **Site configuration → Domain management → Add a domain**.
3. Netlify te da los registros DNS exactos que debes configurar en el
   proveedor donde compraste el dominio. El certificado HTTPS se activa
   solo, gratis, unos minutos después.

---

## Solución de problemas comunes

**"El build falló en Netlify."**
Ve a la pestaña "Deploys" → haz clic en el deploy fallido → revisa el log.
Casi siempre es un error de Python que también verías corriendo
`python freeze.py` en tu computadora — pruébalo ahí primero.

**"La página se ve distinta en Netlify que en mi computadora."**
Prueba sirviendo la carpeta `build/` de forma completamente estática antes
de subir, para descartar el problema:
```bash
python freeze.py
cd build
python3 -m http.server 5500
```
Y abre `http://localhost:5500` — si ahí también se ve mal, el problema está
en el código, no en Netlify.

**"El formulario no aparece en Netlify Forms."**
Asegúrate de que el HTML final (`build/index.html` después de congelar)
todavía contenga `data-netlify="true"` en la etiqueta `<form>` — si en algún
momento editas la plantilla y accidentalmente quitas ese atributo, Netlify
deja de detectarlo. Netlify solo "aprende" sobre el formulario leyendo el
HTML en cada build, así que un cambio recién subido tarda hasta el próximo
deploy en reflejarse.

**"Quiero probar Netlify Forms en mi computadora antes de subir."**
Instala Netlify CLI (`npm install -g netlify-cli`) y corre `netlify dev`
desde la carpeta del proyecto — simula el entorno de Netlify localmente,
incluyendo Forms. Es un paso más avanzado, no es necesario para desplegar.

---

## Lo que esto no cubre (para cuando llegues al proyecto de inventario)

Este método (congelar a estático) funciona porque Dulce Encuentro no
necesita guardar datos que cambien en tiempo real — los sabores y la
galería son listas fijas en `app.py`. El **sistema de inventario** sí va a
necesitar guardar y actualizar datos de verdad (agregar productos, restar
stock), y eso ya no se puede "congelar" a HTML estático — ahí vas a
necesitar un hosting que sí ejecute Python de forma continua, como Render,
Railway o PythonAnywhere. Cuando lleguemos a ese proyecto, te armo la guía
equivalente para esa plataforma.
